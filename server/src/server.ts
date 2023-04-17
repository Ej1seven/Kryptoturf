import express, { Request, Response } from 'express';
import 'dotenv/config';
import Redis from 'ioredis';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const user = require('./routes/userAuth');
const marketItems = require('./routes/marketItems');
const cors = require('cors');
const app = express();
app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', `${process.env.CORS_ORIGIN}`);
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
const redis = new Redis(`${process.env.REDIS_URL}`);
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
app.use('/marketItems', marketItems);
app.use('/uploads', express.static('uploads'));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
