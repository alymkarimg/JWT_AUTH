import { body } from 'express-validator'

export const registerValidator = () => {
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6}).withMessage('Password must be atleast 6 chars long')
}

export const loginValidator = () => {
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6}).withMessage('Invalid password')
}