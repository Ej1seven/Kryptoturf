"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const ioredis_1 = __importDefault(require("ioredis"));
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const user = require('./routes/userAuth');
const marketItems = require('./routes/marketItems');
const cors = require('cors');
const app = (0, express_1.default)();
const redis = new ioredis_1.default(`${process.env.REDIS_URL}`);
redis.on('error', function (error) {
    console.error('Error encountered: ', error);
});
redis.on('connect', function () {
    console.log('Redis connecton establised');
});
app.use(bodyParser.json());
app.set('trust proxy', 1);
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use('/userAuth', user);
// app.use('/user', user);
app.use('/marketItems', marketItems);
app.get('/', (req, res) => {
    res.json({ message: 'hey whats up erik hunter' });
});
app.get('/hello', (req, res) => {
    res.json({ message: 'hey whats up erik 2' });
});
app.listen(process.env.PORT, () => {
    console.log(`Server running on port 3001`);
});
