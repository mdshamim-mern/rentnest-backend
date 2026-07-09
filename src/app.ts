import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import { ApplicationRoutes } from './routes'; 
import globalErrorHandler from './middlewares/globalErrorHandler'; 

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', ApplicationRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'RentNest Server is running perfectly!',
  });
});

app.use(globalErrorHandler);

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
