import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const result = await UserService.getProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const getAdminInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAdminInfo();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin info retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const result = await UserService.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});

export const UserController = { getProfile, getAdminInfo, updateProfile };