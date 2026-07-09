import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RentalService } from './rental.service';

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user; 

  const result = await RentalService.createRentalRequest(user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Rental request created successfully',
    data: result,
  });
});

const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getAllRentalRequests();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental requests retrieved successfully',
    data: result,
  });
});

const updateRentalRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  
  const { status } = req.body;
  const result = await RentalService.updateRentalRequestStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental request status updated successfully',
    data: result,
  });
});

export const RentalController = { 
  createRentalRequest, 
  getAllRentalRequests, 
  updateRentalRequestStatus 
};
