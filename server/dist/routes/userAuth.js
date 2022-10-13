"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ioredis_1 = __importDefault(require("ioredis"));
const validateRegister_1 = require("../utils/validateRegister");
const argon2_1 = __importDefault(require("argon2"));
const process_1 = __importDefault(require("process"));
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const redis = new ioredis_1.default(`${process_1.default.env.REDIS_URL}`);
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        console.log(file);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});
let router = express_1.default.Router();
router.route('/token').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = yield req.cookies.refreshToken;
    if (refreshToken === null)
        return yield res.sendStatus(401);
    const refreshTokens = yield redis.lrange('refreshTokens', 0, -1);
    if (!refreshTokens.includes(refreshToken))
        return res.json('RefreshTokenNotFound');
    yield jwt.verify(refreshToken, process_1.default.env.REFRESH_TOKEN_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.json(err);
        const accessToken = yield jwt.sign(user, process_1.default.env.ACCESS_TOKEN_SECRET);
        const newRefreshToken = yield jwt.sign(user, process_1.default.env.REFRESH_TOKEN_SECRET);
        yield redis.rpush('refreshTokens', newRefreshToken);
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
    }));
    yield redis.lrem('refreshTokens', 0, refreshToken);
}));
router.route('/logout').delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis.lrem('refreshTokens', 0, req.cookies.refreshToken);
    res
        .status(202)
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .json('cookies cleared');
}));
router.route('/register').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, address } = req.body;
    const errors = (0, validateRegister_1.validateRegister)(username, email, password);
    if (errors) {
        return res.json(errors.message);
    }
    const hashedPassword = yield argon2_1.default.hash(password);
    let user;
    try {
        const createUser = yield prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                walletAddress: address,
                turfCoins: 100,
            },
        });
        user = createUser;
    }
    catch (err) {
        if (err.code === 'P2002') {
            if (err.meta.target[0] === 'email') {
                return res.json({
                    message: 'There is a unique constraint violation, a new user cannot be created with this email',
                });
            }
            else if (err.meta.target[0] === 'username') {
                return res.json({
                    message: 'There is a unique constraint violation, a new user cannot be created with this username',
                });
            }
            else if (err.meta.target[0] === 'walletAddress') {
                return res.json({
                    message: 'There is a unique constraint violation, a new user cannot be created with this wallet address',
                });
            }
        }
        else {
            return res.json({ message: err.code });
        }
    }
    return res.json({ user });
}));
router.route('/login').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.header('Access-Control-Allow-Origin', 'https://kryptoturf.com');
    const { usernameOrEmail, password } = req.body;
    const user = yield prisma.user.findUnique(usernameOrEmail.includes('@')
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } });
    if (!user) {
        res.json({ message: "that username doesn't exist" });
    }
    const valid = yield argon2_1.default.verify(user.password, password);
    if (!valid) {
        res.json({ message: 'incorrect password' });
    }
    const accessToken = yield generateAccessToken(user);
    const refreshToken = yield generateRefreshToken(user);
    yield redis.rpush('refreshTokens', refreshToken);
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
}));
router.route('/me').get(authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.user);
}));
function generateAccessToken(user) {
    return jwt.sign(user, process_1.default.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5s',
    });
}
function generateRefreshToken(user) {
    return jwt.sign(user, process_1.default.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '4h',
    });
}
redis.on('error', function (error) {
    console.error('Error encountered: ', error);
});
redis.on('connect', function () {
    console.log('Redis connecton establised');
});
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield req.cookies.accessToken;
        if (accessToken === null)
            return yield res.sendStatus(401);
        yield jwt.verify(accessToken, process_1.default.env.ACCESS_TOKEN_SECRET, (err, user) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return res.json(err.name);
            req.user = user;
            next();
        }));
    });
}
router.route('/images').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profileImage, bannerImage, email } = req.body;
    console.log('body request', req.body);
    let images;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
            select: { profileImage: true, bannerImage: true },
        });
        console.log(user.profileImage);
        console.log(user.bannerImage);
        user.profileImage &&
            fs.unlink(`uploads/${user.profileImage}`, function (err) {
                if (err)
                    return console.log(err);
                console.log('user profile image deleted successfully');
            });
        user.bannerImage &&
            fs.unlink(`uploads/${user.bannerImage}`, function (err) {
                if (err)
                    return console.log(err);
                console.log('user banner image deleted successfully');
            });
        const updateUserImages = yield prisma.user.update({
            where: {
                email: email,
            },
            data: {
                profileImage: profileImage,
                bannerImage: bannerImage,
            },
        });
        images = updateUserImages;
    }
    catch (err) {
        return res.json(err);
    }
    return res.json({ images });
}));
const uploadImages = upload.array('image');
router.route('/upload').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    uploadImages(req, res, function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }
        // Everything went fine.
        const files = req.files;
        console.log(files);
        res.json(files);
    });
}));
router.route('/upload').get((req, res) => {
    res.sendFile('/uploads/');
});
router.route('/user').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailOrContractAddress } = req.body;
    console.log('body request', req.body);
    let userProfile;
    try {
        const user = yield prisma.user.findUnique(emailOrContractAddress.includes('@')
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
            });
        // const user = await User.findOne(
        //   usernameOrEmail.includes('@')
        //     ? { where: { email: usernameOrEmail } }
        //     : { where: { username: usernameOrEmail } }
        // );
        console.log(user);
        userProfile = user;
    }
    catch (err) {
        console.log(err);
        return res.json(err);
    }
    return res.json(userProfile);
}));
router.route('/buyNFT').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buyerAddress, sellerAddress, coins } = req.body;
    console.log('body request', req.body);
    let userProfile;
    let buyingUser;
    let sellingUser;
    try {
        const buyer = yield prisma.user.findUnique({
            where: {
                walletAddress: buyerAddress,
            },
        });
        const seller = yield prisma.user.findUnique({
            where: {
                walletAddress: sellerAddress,
            },
        });
        const buyerTurfCoins = buyer.turfCoins - coins;
        const sellerTurfCoins = seller.turfCoins + coins;
        const newBuyer = yield prisma.user.update({
            where: {
                walletAddress: buyerAddress,
            },
            data: {
                turfCoins: buyerTurfCoins,
            },
        });
        const newSeller = yield prisma.user.update({
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
    }
    catch (err) {
        console.log(err);
        return res.json(err);
    }
    return res.json({ buyingUser, sellingUser });
}));
module.exports = router;
