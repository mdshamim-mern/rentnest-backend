import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod'; // ZodTypeAny এর বদলে সরাসরি ZodType নিয়ে আসলাম
import catchAsync from '../utils/catchAsync';

// এখানে ZodType<any, any, any> ব্যবহার করেছি যাতে যেকোনো স্কিমা সে সাপোর্ট করে
const validateRequest = (schema: ZodType<any, any, any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // ইউজারের পাঠানো ডেটা (body, cookies) আমাদের Zod স্কিমার সাথে মিলিয়ে দেখছি
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });
    
    // সব ঠিক থাকলে পরের ধাপে (কন্ট্রোলারে) পাঠিয়ে দিচ্ছি
    next();
  });
};

export const validateRequestMiddleware = validateRequest;