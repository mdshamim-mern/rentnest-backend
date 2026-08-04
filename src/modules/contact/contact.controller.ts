import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactService } from './contact.service';

const createMessage = catchAsync(async (req: Request, res: Response) => {
    const result = await ContactService.createMessage(req.body);
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Message sent successfully',
        data: result,
    });
});

const getAllMessages = catchAsync(async (req: Request, res: Response) => {
    const result = await ContactService.getAllMessages();
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
    });
});

const updateMessageStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { isRead } = req.body;
    
    const result = await ContactService.updateMessageStatus(id, isRead);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Message status updated successfully',
        data: result,
    });
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    
    const result = await ContactService.deleteMessage(id);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Message deleted successfully',
        data: result,
    });
});

export const ContactController = {
    createMessage,
    getAllMessages,
    updateMessageStatus,
    deleteMessage
};