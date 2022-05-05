import express, { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const user = require('./routes/user');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/user', user);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hey whats up erik' });
});

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});