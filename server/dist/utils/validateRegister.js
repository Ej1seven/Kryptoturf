"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (username, email, password) => {
    if (!email.includes('@')) {
        return { message: 'invalid email' };
    }
    if (username.length <= 2) {
        return { message: 'username length must be greater than 2' };
    }
    if (username.includes('@')) {
        return { message: 'username cannot include an @' };
    }
    if (password.length <= 2) {
        return { message: 'password length must be greater than 2' };
    }
    return null;
};
exports.validateRegister = validateRegister;
