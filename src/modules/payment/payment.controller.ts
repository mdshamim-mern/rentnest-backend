import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const result = await PaymentService.createPaymentIntent(amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment intent created successfully',
    data: result,
  });
});

const savePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.savePayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment saved successfully',
    data: result,
  });
});

export const PaymentController = { 
  createPaymentIntent, 
  savePayment 
};