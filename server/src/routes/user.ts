import express, { Request, Response } from 'express';
import { validateRegister } from '../utils/validateRegister';
import argon2 from 'argon2';
import process from 'process';
import { json } from 'body-parser';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
let router = express.Router();

router.route('/register').post(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const errors = validateRegister(username, email, password);
  if (errors) {
    return res.json(errors.message);
  }
  const hashedPassword = await argon2.hash(password);
  let user: any;
  try {
    const createUser = await prisma.user.create({
      data: { username: username, email: email, password: hashedPassword },
    });
    user = createUser;
    // res.json({ message: `${username} has been created` });
  } catch (err: any) {
    console.log('error: ', err);
    if (err.code === 'P2002') {
      if (err.meta.target[0] === 'email') {
        return res.json({
          message:
            'There is a unique constraint violation, a new user cannot be created with this email',
        });
      } else {
        return res.json({
          message:
            'There is a unique constraint violation, a new user cannot be created with this username',
        });
      }
    }
  }
  return res.json({ user });
});
router.route('/me').get(authenticateToken, async (req: any, res: any) => {
  res.json(req.user);
});

function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
module.exports = router;
