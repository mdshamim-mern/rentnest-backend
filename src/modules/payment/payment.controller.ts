import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const amount = req.body.amount || req.body.price || req.body.totalAmount;
  const rentalRequestId = req.body.rentalRequestId;
  const frontendUrl = req.headers.origin || 'http://localhost:3000';

  if (!amount || !rentalRequestId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Amount or RentalRequestId is missing from request body',
    });
  }

  await PaymentService.savePayment({
    rentalRequestId: rentalRequestId,
    amount: Number(amount),
    transactionId: "txn_stripe_" + Date.now().toString(),
    status: 'PAID'
  });

  const result = await PaymentService.createPaymentSession(Number(amount), frontendUrl);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment session created and saved successfully',
    data: result,
  });
});

const savePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.savePayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment saved and rental status updated to ACTIVE successfully',
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const tenantId = (req as any).user.id;
  const result = await PaymentService.getMyPayments(tenantId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const tenantId = (req as any).user.id;
  const paymentId = req.params.id as string;
  const result = await PaymentService.getPaymentById(paymentId, tenantId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment details retrieved successfully',
    data: result,
  });
});

export const PaymentController = { 
  createPaymentSession, 
  savePayment,
  getMyPayments,
  getPaymentById
};