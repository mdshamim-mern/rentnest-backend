import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

const signup = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signup(req.body);

  const role = (result as any).role || 'User';
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${formattedRole} registered successfully`,
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  const role = (result as any).user?.role || 'User';
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${formattedRole} logged in successfully`,
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await UserService.getProfile(userId);

  const role = (result as any).role || 'User';
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${formattedRole} profile retrieved successfully`,
    data: result,
  });
});

export const AuthController = { 
  signup, 
  login, 
  getMe 
};