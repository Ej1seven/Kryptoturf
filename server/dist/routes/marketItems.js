"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
        if (file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let router = express_1.default.Router();
router.route('/collection').get((_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield prisma.marketItems.findMany();
    res.json(collections);
}));
router.route('/collection').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId } = yield req.body;
    console.log(collectionId);
    // const collection = await prisma.marketItems.findUnique({
    //   where: { contactAddress: collectionId },
    // });
    res.json(collectionId);
}));
const uploadImages = upload.array('image');
router.route('/upload').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    uploadImages(req, res, function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }
        // Everything went fine.
        const files = req.files;
        console.log(files);
        res.json(files);
    });
}));
router.route('/upload').get((req, res) => {
    res.sendFile('/uploads/');
});
module.exports = router;
