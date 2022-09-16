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

router.route('/collections').get(async (_, res: any) => {
  const collections = await prisma.marketItems.findMany();
  res.json(collections);
});
router.route('/collection').post(async (req: Request, res: any) => {
  const {
    title,
    contractAddress,
    description,
    createdBy,
    owners,
    profileImage,
    bannerImage,
    logoImage,
  } = req.body;
  console.log('body request', req.body);
  let collection: any;
  try {
    const createCollection = await prisma.MarketItems.create({
      data: {
        title: title,
        contractAddress: contractAddress,
        description: description,
        createdBy: createdBy,
        owners: owners,
        profileImage: profileImage,
        bannerImage: bannerImage,
        logoImage: logoImage,
        volumeTraded: 0,
        floorPrice: 0,
      },
    });
    collection = createCollection;
  } catch (err: any) {
    return res.json(err);
  }
  // const collection = await prisma.marketItems.findUnique({
  //   where: { contactAddress: collectionId },
  // });
  return res.json({ collection });
});
router.route('/collection/:id').get(async (req: Request, res: any) => {
  const { id } = req.params;
  const collection = await prisma.marketItems.findUnique({
    where: { contractAddress: id },
    include: {
      likes: true, // Return all fields
    },
  });
  return res.json({ collection });
});
router.route('/collection').post(async (req: Request, res: any) => {
  const {
    title,
    contractAddress,
    description,
    createdBy,
    owners,
    profileImage,
    bannerImage,
    logoImage,
  } = req.body;
  console.log('body request', req.body);
  let collection: any;
  try {
    const createCollection = await prisma.MarketItems.create({
      data: {
        title: title,
        contractAddress: contractAddress,
        description: description,
        createdBy: createdBy,
        owners: owners,
        profileImage: profileImage,
        bannerImage: bannerImage,
        logoImage: logoImage,
        volumeTraded: 0,
        floorPrice: 0,
      },
    });
    collection = createCollection;
  } catch (err: any) {
    return res.json(err);
  }
  // const collection = await prisma.marketItems.findUnique({
  //   where: { contactAddress: collectionId },
  // });
  return res.json({ collection });
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
router.route('/likes').post(async (req: Request, res: Response) => {
  const { collectionContractAddress, tokenId, nftName, email } = req.body;
  console.log('body request', req.body);
  let post: any;
  try {
    const like = await prisma.like.create({
      data: {
        tokenId: tokenId,
        nftName: nftName,
        collectionContractAddress: collectionContractAddress,
        email: email,
      },
    });
    post = like;
  } catch (err: any) {
    console.log(err);
    return res.json(err);
  }
  return res.json(post);
});
router.route('/likes/:id').get(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  let likes;
  try {
    const collectionLikes = await prisma.marketItems.findUnique({
      where: {
        contractAddress: id,
      },
      select: { likes: true },
    });
    likes = collectionLikes;
  } catch (err: any) {
    console.log(err);
    return res.json(err);
  }
  return res.json(likes);
});
router.route('/likes/:id').delete(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  let deletedLike;
  try {
    const deleteLike = await prisma.like.delete({
      where: {
        id: Number(id),
      },
    });
    deletedLike = deleteLike;
  } catch (err: any) {
    console.log(err);
    return res.json(err);
  }
  return res.json(deletedLike);
});
module.exports = router;
