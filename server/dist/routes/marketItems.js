'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
let wrongFormat;
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    console.log(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
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
let router = express_1.default.Router();
router.route('/collections').get((_, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield prisma.marketItems.findMany();
    res.json(collections);
  })
);
router.route('/collection').post((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
    let collection;
    try {
      const createCollection = yield prisma.MarketItems.create({
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
    } catch (err) {
      return res.json(err);
    }
    // const collection = await prisma.marketItems.findUnique({
    //   where: { contactAddress: collectionId },
    // });
    return res.json({ collection });
  })
);
router.route('/collection/:id').get((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const collection = yield prisma.marketItems.findUnique({
      where: { contractAddress: id },
      include: {
        likes: true, // Return all fields
      },
    });
    return res.json({ collection });
  })
);
router.route('/collection').post((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
    let collection;
    try {
      const createCollection = yield prisma.MarketItems.create({
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
    } catch (err) {
      return res.json(err);
    }
    // const collection = await prisma.marketItems.findUnique({
    //   where: { contactAddress: collectionId },
    // });
    return res.json({ collection });
  })
);
const uploadImages = upload.array('image');
router.route('/upload').post((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    uploadImages(req, res, function (err) {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      // Everything went fine.
      const files = req.files;
      console.log(files);
      res.json(files);
    });
  })
);
router.route('/upload').get((req, res) => {
  res.sendFile('/uploads/');
});
router.route('/likes').post((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { collectionContractAddress, tokenId, nftName, email } = req.body;
    console.log('body request', req.body);
    let post;
    try {
      const like = yield prisma.like.create({
        data: {
          tokenId: tokenId,
          nftName: nftName,
          collectionContractAddress: collectionContractAddress,
          email: email,
        },
      });
      post = like;
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(post);
  })
);
router.route('/likes/:id').get((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    let likes;
    try {
      const collectionLikes = yield prisma.marketItems.findUnique({
        where: {
          contractAddress: id,
        },
        select: { likes: true },
      });
      likes = collectionLikes;
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(likes);
  })
);
router.route('/likes/:id').delete((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    let deletedLike;
    try {
      const deleteLike = yield prisma.like.delete({
        where: {
          id: Number(id),
        },
      });
      deletedLike = deleteLike;
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(deletedLike);
  })
);
router.route('/transactions').post((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const {
      collectionContractAddress,
      tokenId,
      event,
      price,
      from,
      to,
      blockNumber,
      txHash,
    } = req.body;
    console.log('body request', req.body);
    let transaction;
    try {
      const transactionData = yield prisma.NftTransactions.create({
        data: {
          collectionContractAddress: collectionContractAddress,
          tokenId: tokenId,
          event: event,
          price: price,
          from: from,
          to: to,
          blockNumber: blockNumber,
          txHash: txHash,
        },
      });
      transaction = transactionData;
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(transaction);
  })
);
router
  .route('/transactions/:collectionContractAddress/:tokenId')
  .get((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { collectionContractAddress, tokenId } = req.params;
      console.log('body request', req.params);
      let tokenTransactions;
      try {
        const transactions = yield prisma.NftTransactions.findMany({
          where: {
            AND: [
              {
                collectionContractAddress: collectionContractAddress,
              },
              {
                tokenId: Number(tokenId),
              },
            ],
          },
        });
        tokenTransactions = transactions;
      } catch (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(tokenTransactions);
    })
  );
module.exports = router;
