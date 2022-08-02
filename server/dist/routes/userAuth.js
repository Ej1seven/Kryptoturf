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
module.exports = router;
