import express, { Request, Response } from 'express';
const fs = require('fs');
const path = require('path');
const multer = require('multer');
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
const upload = multer({ storage: storage });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let router = express.Router();

router.route('/collection').get(async (_, res: any) => {
  const collections = await prisma.marketItems.findMany();
  res.json(collections);
});
router.route('/collection').post(async (req: Request, res: any) => {
  const { collectionId } = await req.body;
  console.log(collectionId);
  // const collection = await prisma.marketItems.findUnique({
  //   where: { contactAddress: collectionId },
  // });
  res.json(collectionId);
});
router.route('/upload').post(upload.array('image'), (req: any, res: any) => {
  res.send('image uploaded');
  let originalFileName = req.files;
  console.log(originalFileName);
});
router.route('/upload').get((req: any, res: any) => {
  res.sendFile('/uploads/');
});
module.exports = router;
