import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PropertyService } from './property.service';

const parsePropertyData = (data: any) => {
  const parsedData = { ...data };
  const numericFields = ['price', 'floorArea', 'bedrooms', 'bathrooms', 'balcony', 'serviceCharge'];
  
  numericFields.forEach((field) => {
    if (parsedData[field] !== undefined && parsedData[field] !== null && parsedData[field] !== "") {
      parsedData[field] = Number(parsedData[field]);
    }
  });

  if (typeof parsedData.rentNegotiable === 'string') {
    parsedData.rentNegotiable = parsedData.rentNegotiable === 'true';
  }
  
  if (typeof parsedData.isAvailable === 'string') {
    parsedData.isAvailable = parsedData.isAvailable === 'true';
  }

  return parsedData;
};

const uploadToImgBB = async (buffer: Buffer) => {
  const params = new URLSearchParams();
  params.append('image', buffer.toString('base64'));
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
    method: 'POST',
    body: params,
  });
  const data = await response.json();
  return data.data.display_url;
};

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user; 
  const parsedBody = parsePropertyData(req.body);
  
  if (req.files && Array.isArray(req.files)) {
    const imageUrls = await Promise.all(req.files.map((file: any) => uploadToImgBB(file.buffer)));
    if (imageUrls.length > 0) {
      parsedBody.images = imageUrls;
    }
  } else if (req.file) {
    parsedBody.image = await uploadToImgBB((req as any).file.buffer);
  }

  const result = await PropertyService.createProperty(user.id, parsedBody);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Property created successfully',
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.getAllProperties(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Properties retrieved successfully',
    data: result,
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string; 
  const result = await PropertyService.getPropertyById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Property retrieved successfully',
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const parsedBody = parsePropertyData(req.body);

  if (req.files && Array.isArray(req.files)) {
    const imageUrls = await Promise.all(req.files.map((file: any) => uploadToImgBB(file.buffer)));
    if (imageUrls.length > 0) {
      parsedBody.images = imageUrls;
    }
  } else if (req.file) {
    parsedBody.image = await uploadToImgBB((req as any).file.buffer);
  }

  const result = await PropertyService.updateProperty(id, parsedBody);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Property updated successfully',
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await PropertyService.deleteProperty(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Property deleted successfully',
    data: result,
  });
});

export const PropertyController = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};