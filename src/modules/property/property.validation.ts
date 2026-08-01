import { z } from 'zod';

const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z.string({
      message: 'Title is required',
    }),
    description: z.string({
      message: 'Description is required',
    }),
    location: z.string({
      message: 'Location is required',
    }),
    price: z.number({
      message: 'Price is required',
    }).positive('Price must be a positive number'),
    categoryId: z.string({
      message: 'Category ID is required',
    }),
    rentType: z.string().optional().nullable(),
    rentNegotiable: z.boolean().optional(),
    floorArea: z.number().positive().optional().nullable(),
    rentFor: z.array(z.string()).optional(),
    bedrooms: z.number().nonnegative().optional().nullable(),
    bathrooms: z.number().nonnegative().optional().nullable(),
    balcony: z.number().nonnegative().optional().nullable(),
    floorLevel: z.string().optional().nullable(),
    gas: z.string().optional().nullable(),
    parking: z.string().optional().nullable(),
    lift: z.string().optional().nullable(),
    furnished: z.string().optional().nullable(),
    facing: z.string().optional().nullable(),
    serviceCharge: z.number().nonnegative().optional().nullable(),
    availableFrom: z.string().optional().nullable(),
    amenities: z.array(z.string()).optional(),
    videoLink: z.string().url().optional().nullable(),
    newBuild: z.string().optional().nullable(),
    propertyType: z.string().optional().nullable(),
    image: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

const updatePropertyValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().optional(),
    rentType: z.string().optional().nullable(),
    rentNegotiable: z.boolean().optional(),
    floorArea: z.number().positive().optional().nullable(),
    rentFor: z.array(z.string()).optional(),
    bedrooms: z.number().nonnegative().optional().nullable(),
    bathrooms: z.number().nonnegative().optional().nullable(),
    balcony: z.number().nonnegative().optional().nullable(),
    floorLevel: z.string().optional().nullable(),
    gas: z.string().optional().nullable(),
    parking: z.string().optional().nullable(),
    lift: z.string().optional().nullable(),
    furnished: z.string().optional().nullable(),
    facing: z.string().optional().nullable(),
    serviceCharge: z.number().nonnegative().optional().nullable(),
    availableFrom: z.string().optional().nullable(),
    amenities: z.array(z.string()).optional(),
    videoLink: z.string().url().optional().nullable(),
    newBuild: z.string().optional().nullable(),
    propertyType: z.string().optional().nullable(),
    image: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    isAvailable: z.boolean().optional(),
  }),
});

export const PropertyValidation = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};