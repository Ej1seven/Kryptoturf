import express, { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let router = express.Router();

router.route('/collections').get(async (_, res: any) => {
  const collections = await prisma.marketItems.findMany();
  res.json(collections);
});
router.route('/collection').post(async (req: Request, res: any) => {
  const { collectionId } = req.body;
  const collection = await prisma.marketItems.findUnique({
    where: { contactAddress: collectionId },
  });
  return res.json(collection);
});
module.exports = router;
