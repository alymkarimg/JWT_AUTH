import { NextFunction, Request, Response } from 'express';
import { ContextRunner, body, validationResult } from 'express-validator';
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if ((result as any).errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array().map(error => (error as any).msg) });
  };
};

export const registerValidator = validate([
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6}).withMessage('Password must be atleast 6 chars long') 
])

export const loginValidator = validate([
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6}).withMessage('Invalid password')
])