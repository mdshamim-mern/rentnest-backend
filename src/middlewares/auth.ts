import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../config';

export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'You are not authorized',
        });
      }

      // এরর ১ ফিক্স: টোকেন স্প্লিট করার পর শিওর হচ্ছি যে এটা স্ট্রিং
      const tokenWithoutBearer = token.split(' ')[1] as string;

      // এরর ২ ফিক্স: config.jwt.secret এর বদলে config.jwt.access_secret ব্যবহার করা হয়েছে
      const verifiedUser = jwt.verify(
        tokenWithoutBearer,
        config.jwt.access_secret as Secret
      ) as any;

      (req as any).user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: 'You are forbidden',
        });
      }

      next();
    } catch (error) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  };
};