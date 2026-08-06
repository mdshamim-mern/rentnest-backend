import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SavedSearchService } from './savedSearch.service';

const createSavedSearch = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const payload = { ...req.body };
  
  if (user?.userId || user?.id) {
    payload.userId = user.userId || user.id;
  }
  
  const result = await SavedSearchService.createSavedSearchIntoDB(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Search saved successfully',
    data: result,
  });
});

const getAllSavedSearches = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const rawUserId = user?.userId || user?.id || req.query.userId || req.body.userId;
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : String(rawUserId || '');
  
  const result = await SavedSearchService.getAllSavedSearchesFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Saved searches retrieved successfully',
    data: result,
  });
});

const deleteSavedSearch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const targetId = Array.isArray(id) ? id[0] : String(id || '');
  
  const result = await SavedSearchService.deleteSavedSearchFromDB(targetId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Saved search deleted successfully',
    data: result,
  });
});

export const SavedSearchController = {
  createSavedSearch,
  getAllSavedSearches,
  deleteSavedSearch
};