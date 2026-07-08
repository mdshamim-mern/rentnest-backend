import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = err.message || 'Something went wrong!';
  let errorDetails: any = err;

  // ১. Zod Validation Error হ্যান্ডেল করা
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    // Zod এর বিশাল এরর অবজেক্ট থেকে শুধু দরকারি অংশটুকু বের করে নিচ্ছি
    errorDetails = {
      issues: err.issues.map((issue) => ({
        field: issue.path[issue.path.length - 1],
        message: issue.message,
      })),
    };
  } 
  // ২. Prisma Error হ্যান্ডেল করা (যেমন: একই ইমেইল দিয়ে দুইবার একাউন্ট খুলতে চাইলে)
  else if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      statusCode = 400;
      message = 'Duplicate Key Error';
      errorDetails = err.meta;
    }
  } 
  // ৩. Prisma Validation Error
  else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Prisma Validation Error';
    errorDetails = err.message;
  }

  // অ্যাসাইনমেন্টের ম্যান্ডেটরি রিকোয়ারমেন্ট অনুযায়ী রেসপন্স পাঠানো হচ্ছে
  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;