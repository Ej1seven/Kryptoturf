import express, { Request, Response } from 'express';
import Redis from 'ioredis';
import { validateRegister } from '../utils/validateRegister';
import argon2 from 'argon2';
import process from 'process';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const redis = new Redis(`${process.env.REDIS_URL}`);
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, 'uploads');
  },
  filename: function (req: any, file: any, cb: any) {
    console.log(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

let router = express.Router();

router.route('/token').get(async (req: any, res: Response) => {
  const refreshToken = await req.cookies.refreshToken;
  if (refreshToken === null) return await res.sendStatus(401);
  const refreshTokens = await redis.lrange('refreshTokens', 0, -1);
  if (!refreshTokens.includes(refreshToken))
    return res.json('RefreshTokenNotFound');
  await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err: any, user: any) => {
      if (err) return res.json(err);
      const accessToken = await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      const newRefreshToken = await jwt.sign(
        user,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.rpush('refreshTokens', newRefreshToken);
      res
        .status(202)
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        })
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        })
        .json(user);
    }
  );
  await redis.lrem('refreshTokens', 0, refreshToken);
});

router.route('/logout').delete(async (req: Request, res: Response) => {
  await redis.lrem('refreshTokens', 0, req.cookies.refreshToken);
  res
    .status(202)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json('cookies cleared');
});

router.route('/register').post(async (req: Request, res: Response) => {
  const { username, email, password, address } = req.body;
  const errors = validateRegister(username, email, password);
  if (errors) {
    return res.json(errors.message);
  }
  const hashedPassword = await argon2.hash(password);
  let user: any;
  try {
    const createUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        walletAddress: address,
      },
    });
    user = createUser;
  } catch (err: any) {
    if (err.code === 'P2002') {
      if (err.meta.target[0] === 'email') {
        return res.json({
          message:
            'There is a unique constraint violation, a new user cannot be created with this email',
        });
      } else if (err.meta.target[0] === 'username') {
        return res.json({
          message:
            'There is a unique constraint violation, a new user cannot be created with this username',
        });
      } else if (err.meta.target[0] === 'walletAddress') {
        return res.json({
          message:
            'There is a unique constraint violation, a new user cannot be created with this wallet address',
        });
      }
    } else {
      return res.json({ message: err.code });
    }
  }
  return res.json({ user });
});

router.route('/login').post(async (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', 'https://kryptoturf.com');
  const { usernameOrEmail, password } = req.body;
  const user = await prisma.user.findUnique(
    usernameOrEmail.includes('@')
      ? { where: { email: usernameOrEmail } }
      : { where: { username: usernameOrEmail } }
  );
  if (!user) {
    res.json({ message: "that username doesn't exist" });
  }
  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    res.json({ message: 'incorrect password' });
  }
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);
  await redis.rpush('refreshTokens', refreshToken);
  res
    .status(202)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })
    .json({ accessToken: accessToken, refreshToken: refreshToken });

  // return res.json(user);
});
router.route('/me').get(authenticateToken, async (req: any, res: any) => {
  res.json(req.user);
});

function generateAccessToken(user: any) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '5s',
  });
}
function generateRefreshToken(user: any) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '4h',
  });
}
redis.on('error', function (error) {
  console.error('Error encountered: ', error);
});
redis.on('connect', function () {
  console.log('Redis connecton establised');
});

async function authenticateToken(req: any, res: any, next: any) {
  const accessToken = await req.cookies.accessToken;
  if (accessToken === null) return await res.sendStatus(401);
  await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: any, user: any) => {
      if (err) return res.json(err.name);

      req.user = user;
      next();
    }
  );
}

router.route('/images').post(async (req: Request, res: Response) => {
  const { profileImage, bannerImage, email } = req.body;
  console.log('body request', req.body);
  let images: any;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: { profileImage: true, bannerImage: true },
    });
    console.log(user.profileImage);
    console.log(user.bannerImage);
    user.profileImage &&
      fs.unlink(`uploads/${user.profileImage}`, function (err: any) {
        if (err) return console.log(err);
        console.log('user profile image deleted successfully');
      });
    user.bannerImage &&
      fs.unlink(`uploads/${user.bannerImage}`, function (err: any) {
        if (err) return console.log(err);
        console.log('user banner image deleted successfully');
      });
    const updateUserImages = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        profileImage: profileImage,
        bannerImage: bannerImage,
      },
    });
    images = updateUserImages;
  } catch (err: any) {
    return res.json(err);
  }
  return res.json({ images });
});

const uploadImages = upload.array('image');
router.route('/upload').post(async (req: any, res: any) => {
  uploadImages(req, res, function (err: any) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    // Everything went fine.
    const files = req.files;
    console.log(files);
    res.json(files);
  });
});
router.route('/upload').get((req: any, res: any) => {
  res.sendFile('/uploads/');
});
router.route('/user').post(async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log('body request', req.body);
  let userProfile: any;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        likes: true, // Return all fields
      },
    });
    console.log(user);
    userProfile = user;
  } catch (err: any) {
    return res.json(err);
  }
  return res.json(userProfile);
});

module.exports = router;
