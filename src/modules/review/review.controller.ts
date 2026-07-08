import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user; 
  const result = await ReviewService.createReview(user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review added successfully',
    data: result,
  });
});

const getReviewsByProperty = catchAsync(async (req: Request, res: Response) => {
  const propertyId = req.params.propertyId as string;
  const result = await ReviewService.getReviewsByProperty(propertyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

export const ReviewController = { createReview, getReviewsByProperty };