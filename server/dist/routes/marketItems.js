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
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let router = express_1.default.Router();
router.route('/collections').get((_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield prisma.marketItems.findMany();
    res.json(collections);
}));
router.route('/collection').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId } = req.body;
    const collection = yield prisma.marketItems.findUnique({
        where: { contactAddress: collectionId },
    });
    return res.json(collection);
}));
module.exports = router;
