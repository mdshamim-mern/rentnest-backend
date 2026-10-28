import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApplicationRoutes } from './routes'; 
import globalErrorHandler from './middlewares/globalErrorHandler'; 

import { adminDemo } from './middlewares/adminDemo';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use('/api', adminDemo);
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(uploadDir));

app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(httpStatus.OK).json({
    success: true,
    message: 'File uploaded successfully',
    data: { url: imageUrl }
  });
});

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