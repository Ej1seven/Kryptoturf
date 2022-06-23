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
const validateRegister_1 = require("../utils/validateRegister");
const argon2_1 = __importDefault(require("argon2"));
const process_1 = __importDefault(require("process"));
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
let router = express_1.default.Router();
router.route('/register').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const errors = (0, validateRegister_1.validateRegister)(username, email, password);
    if (errors) {
        return res.json(errors.message);
    }
    const hashedPassword = yield argon2_1.default.hash(password);
    let user;
    try {
        const createUser = yield prisma.user.create({
            data: { username: username, email: email, password: hashedPassword },
        });
        user = createUser;
        // res.json({ message: `${username} has been created` });
    }
    catch (err) {
        console.log('error: ', err);
        if (err.code === 'P2002') {
            if (err.meta.target[0] === 'email') {
                return res.json({
                    message: 'There is a unique constraint violation, a new user cannot be created with this email',
                });
            }
            else {
                return res.json({
                    message: 'There is a unique constraint violation, a new user cannot be created with this username',
                });
            }
        }
    }
    return res.json({ user });
}));
router.route('/me').get(authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.user);
}));
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null)
        return res.sendStatus(401);
    jwt.verify(token, process_1.default.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
module.exports = router;
