import express, { Request, Response } from 'express';
let wrongFormat: any;
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
const upload = multer({
  storage: storage,
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});
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

const uploadImages = upload.array('image');
router.route('/upload').post(async (req: any, res: any) => {
  uploadImages(req, res, function (err: any) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    // Everything went fine.
    const files = req.files;
    console.log(files);
    res.json(files);
  });
});
router.route('/upload').get((req: any, res: any) => {
  res.sendFile('/uploads/');
});
module.exports = router;
