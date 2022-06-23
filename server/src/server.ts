import express, { Request, Response } from 'express';
import 'dotenv/config';
import Redis from 'ioredis';
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const user = require('./routes/user');
const marketItems = require('./routes/marketItems');
const cors = require('cors');
const app = express();
const redis = new Redis(`${process.env.REDIS_URL}`);
redis.on('error', function (error) {
  console.error('Error encountered: ', error);
});
redis.on('connect', function () {
  console.log('Redis connecton establised');
});

app.use(bodyParser.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
// app.use('/user', user);
app.use('/marketItems', marketItems);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hey whats up erik' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port 3001`);
});
