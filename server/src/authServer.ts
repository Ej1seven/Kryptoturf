import express, { Request, Response } from 'express';
import 'dotenv/config';
import Redis from 'ioredis';
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const prisma = new PrismaClient();
const user = require('./routes/userAuth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const redis = new Redis(`${process.env.REDIS_URL}`);
redis.on('error', function (error) {
  console.error('Error encountered: ', error);
});
redis.on('connect', function () {
  console.log('Redis connecton established');
});

app.use(bodyParser.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use('/userAuth', user);

app.listen(process.env.PORT2, () => {
  console.log(`Server running on port 4001`);
});
