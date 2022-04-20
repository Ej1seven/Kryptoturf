import express, { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const prisma = new PrismaClient();
const user = require('./routes/userAuth');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/userAuth', user);

app.listen(4001, () => {
  console.log(`Server running on port 4001`);
});
