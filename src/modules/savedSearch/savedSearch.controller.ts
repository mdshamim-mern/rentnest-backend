import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { prisma } from '../../lib/prisma';

const createSavedSearch = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.savedSearch.create({
    data: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Search saved successfully',
    data: result,
  });
});

const getAllSavedSearches = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.savedSearch.findMany({
    orderBy: { createdAt: 'desc' }
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Saved searches retrieved successfully',
    data: result,
  });
});

export const SavedSearchController = {
  createSavedSearch,
  getAllSavedSearches
};