import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import { ApplicationRoutes } from './routes'; 
import globalErrorHandler from './middlewares/globalErrorHandler'; // নতুন তৈরি করা ফাইলটি ইমপোর্ট করলাম

const app: Application = express();

// পার্সার (Parsers)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// মেইন এপিআই রাউটার কানেকশন
app.use('/api', ApplicationRoutes);

// বেস রাউট (সার্ভার চেক করার জন্য)
app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'RentNest Server is running perfectly!',
  });
});

// গ্লোবাল এরর হ্যান্ডলার (এটি সবসময় অন্যান্য রাউটের নিচে থাকে)
app.use(globalErrorHandler);

// গ্লোবাল নট ফাউন্ড (Not Found) রাউট হ্যান্ডলার - এখানেও ম্যান্ডেটরি ফরম্যাট মেনে চলা হয়েছে
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
    errorDetails: {
      path: req.originalUrl,
      message: 'Your requested path is not found on this server',
    },
  });
});

export default app;