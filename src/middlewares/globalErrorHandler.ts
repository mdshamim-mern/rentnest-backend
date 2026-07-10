import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = err.message || 'Something went wrong!';
  let errorDetails: any = err;

  
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
  
    errorDetails = {
      issues: err.issues.map((issue) => ({
        field: issue.path[issue.path.length - 1],
        message: issue.message,
      })),
    };
  } 
  else if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      statusCode = 400;
      message = 'Duplicate Key Error';
      errorDetails = err.meta;
    }
  } 
  
  else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Prisma Validation Error';
    errorDetails = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
