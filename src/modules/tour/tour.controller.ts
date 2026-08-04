import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TourService } from './tour.service';

const createTourRequest = catchAsync(async (req: Request, res: Response) => {
    const tenantId = (req as any).user.id;
    const { propertyId } = req.body;
    
    const result = await TourService.createTourRequest(tenantId, propertyId);
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Tour requested successfully',
        data: result,
    });
});

const getLandlordTourRequests = catchAsync(async (req: Request, res: Response) => {
    const landlordId = (req as any).user.id;
    
    const result = await TourService.getLandlordTourRequests(landlordId);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Tour requests retrieved successfully',
        data: result,
    });
});

const getMyTourRequests = catchAsync(async (req: Request, res: Response) => {
    const tenantId = (req as any).user.id;
    
    const result = await TourService.getMyTourRequests(tenantId);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My tour requests retrieved successfully',
        data: result,
    });
});

export const TourController = {
    createTourRequest,
    getLandlordTourRequests,
    getMyTourRequests
};