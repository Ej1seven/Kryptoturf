import express, { Request, Response } from 'express';
import Redis from 'ioredis';
import { validateRegister } from '../utils/validateRegister';
import argon2 from 'argon2';
import process from 'process';
const { PrismaClient } = require('@prisma/client');
var hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const redis = new Redis(`${process.env.REDIS_URL}`);
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: path.resolve('./views'),
    defaultLayout: false,
  },
  viewPath: path.resolve('src/views'),
  extName: '.handlebars',
};
transporter.use('compile', hbs(handlebarOptions));
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
/*Determines if the refresh token is active or expired. If the refresh token is expired or null the server will respond with error message "RefreshTokenNotFound"*/
router.route('/token').get(async (req: any, res: Response) => {
  /*Retrieves the refresh token from the front-end which is stored in a cookie. */
  const refreshToken = await req.cookies.refreshToken;
  /*If the refresh token is not found then the server will respond with error message "RefreshTokenNotFound"*/
  if (refreshToken === null) return await res.sendStatus(401);
  /*refreshTokens retrieves all items from redis with the "refreshTokens" key. 0 indicates the first element on the list and -1 is the last element on the list*/
  const refreshTokens = await redis.lrange('refreshTokens', 0, -1);
  /*If the refresh token is not found then the server will respond will respond with error message "RefreshTokenNotFound" */
  if (!refreshTokens.includes(refreshToken))
    return res.json('RefreshTokenNotFound');
  /*If the refresh token is found then JWT authenticates the token by comparing it to the 
    REFRESH_TOKEN_SECRET environment variable */
  await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err: any, user: any) => {
      if (err) return res.json(err);
      /*If the refresh token is authenticated then a new access token and refresh token will be created */
      const accessToken = await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      const newRefreshToken = await jwt.sign(
        user,
        process.env.REFRESH_TOKEN_SECRET
      );
      /*The new refresh token is pushed to redis and the server sends a new refresh and access token
      to the front-end through a cookie. The server also sends the user data. */
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
  /*Redis removes the old refresh token after adding the new one. */
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
        turfCoins: 100,
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
  console.log(user.id);
  jwt.sign(
    {
      userId: user.id,
    },
    process.env.EMAIL_SECRET,
    {
      expiresIn: '1d',
    },
    (err: any, emailToken: any) => {
      const url = `${process.env.REACT_APP_API_URL}/userAuth/confirmation/${emailToken}`;

      var mail = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Confirm Email',
        template: 'email',
        context: {
          url: url,
          name: user.username,
        },
        attachments: [
          {
            filename: 'logo.png',
            path: path.resolve('src/views/logo.png'),
            cid: 'logo',
          },
          {
            filename: 'github.png',
            path: path.resolve('src/views/github.png'),
            cid: 'github',
          },
          {
            filename: 'linkedin.png',
            path: path.resolve('src/views/linkedin.png'),
            cid: 'linkedin',
          },
        ],
      };

      transporter.sendMail(mail, function (error: any, info: any) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent:' + info.response);
        }
      });
      // transporter.sendMail({
      //   to: email,
      //   subject: 'Confirm Email',
      //   html: `Please click button to confirm your email: <a href="${url}">${url}</a>`,
      // });
    }
  );
  return res.json({ user });
});

router
  .route('/confirmation/:token')
  .get(async (req: Request, res: Response) => {
    try {
      const { userId } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          confirmed: true,
        },
      });
    } catch (e) {
      res.send('error');
    }
    return res.redirect(`${process.env.CORS_ORIGIN}/login`);
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
    return res.json({ message: "that username doesn't exist" });
  }
  if (!user.confirmed) {
    return res.json({ message: 'Please confirm your email to login' });
  }
  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    return res.json({ message: 'incorrect password' });
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
/*authenticates the JWT access token and determines if the token is active or expired.
  If the access token is null then the server will respond with error message "TokenExpiredError".
  If the access token is active then the server will respond with the user data */
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
  const { emailOrContractAddress } = req.body;
  console.log('body request', req.body);
  let userProfile: any;
  try {
    const user = await prisma.user.findUnique(
      emailOrContractAddress.includes('@')
        ? {
            where: {
              email: emailOrContractAddress,
            },
            include: {
              likes: true, // Return all fields
            },
          }
        : {
            where: {
              walletAddress: emailOrContractAddress,
            },
            include: {
              likes: true, // Return all fields
            },
          }
    );
    // const user = await User.findOne(
    //   usernameOrEmail.includes('@')
    //     ? { where: { email: usernameOrEmail } }
    //     : { where: { username: usernameOrEmail } }
    // );
    console.log(user);
    userProfile = user;
  } catch (err: any) {
    console.log(err);
    return res.json(err);
  }
  return res.json(userProfile);
});
router.route('/buyNFT').post(async (req: Request, res: Response) => {
  const {
    buyerAddress,
    sellerAddress,
    royaltyOwnerAddress,
    royaltyFee,
    coins,
  } = req.body;
  console.log('body request', req.body);
  let buyingUser: any;
  let sellingUser: any;
  let royaltyUser: any;
  try {
    const buyer = await prisma.user.findUnique({
      where: {
        walletAddress: buyerAddress,
      },
    });
    const seller = await prisma.user.findUnique({
      where: {
        walletAddress: sellerAddress,
      },
    });
    const buyerTurfCoins = buyer.turfCoins - coins;
    let sellerTurfCoins: any;
    if (sellerAddress !== royaltyOwnerAddress) {
      const royaltyOwner = await prisma.user.findUnique({
        where: {
          walletAddress: royaltyOwnerAddress,
        },
      });
      const royaltyFeeConverted = (royaltyFee / 100) * coins;
      const royaltyOwnerTurfCoins =
        royaltyOwner.turfCoins + royaltyFeeConverted;
      sellerTurfCoins = seller.turfCoins + coins - royaltyFeeConverted;
      const newRoyaltyUser = await prisma.user.update({
        where: {
          walletAddress: royaltyOwnerAddress,
        },
        data: {
          turfCoins: royaltyOwnerTurfCoins,
        },
      });
      royaltyUser = newRoyaltyUser;
    } else {
      sellerTurfCoins = seller.turfCoins + coins;
    }

    const newBuyer = await prisma.user.update({
      where: {
        walletAddress: buyerAddress,
      },
      data: {
        turfCoins: buyerTurfCoins,
      },
    });
    const newSeller = await prisma.user.update({
      where: {
        walletAddress: sellerAddress,
      },
      data: {
        turfCoins: sellerTurfCoins,
      },
    });
    // const user = await User.findOne(
    //   usernameOrEmail.includes('@')
    //     ? { where: { email: usernameOrEmail } }
    //     : { where: { username: usernameOrEmail } }
    // );
    buyingUser = newBuyer;
    sellingUser = newSeller;
    console.log(buyer);
    console.log(seller);
    // userProfile = user;
  } catch (err: any) {
    console.log(err);
    return res.json(err);
  }
  return res.json({ buyingUser, sellingUser, royaltyUser });
});

router.route('/users').get(async (req: Request, res: Response) => {
  let allUsers: any;
  try {
    const users = await prisma.user.findMany();
    allUsers = users;
    console.log(users);
  } catch (err: any) {
    console.log(err);
    return res.json(err);
  }
  return res.json(allUsers);
});

module.exports = router;
