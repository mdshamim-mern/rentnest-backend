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
    rentType: z.string().optional(),
    rentNegotiable: z.boolean().optional(),
    floorArea: z.number().positive().optional(),
    rentFor: z.array(z.string()).optional(),
    bedrooms: z.number().nonnegative().optional(),
    bathrooms: z.number().nonnegative().optional(),
    balcony: z.number().nonnegative().optional(),
    floorLevel: z.string().optional(),
    gas: z.string().optional(),
    parking: z.string().optional(),
    lift: z.string().optional(),
    furnished: z.string().optional(),
    facing: z.string().optional(),
    serviceCharge: z.number().nonnegative().optional(),
    availableFrom: z.string().datetime().optional(),
    amenities: z.array(z.string()).optional(),
    videoLink: z.string().url().optional(),
    newBuild: z.string().optional(),
    propertyType: z.string().optional(),
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
    rentType: z.string().optional(),
    rentNegotiable: z.boolean().optional(),
    floorArea: z.number().positive().optional(),
    rentFor: z.array(z.string()).optional(),
    bedrooms: z.number().nonnegative().optional(),
    bathrooms: z.number().nonnegative().optional(),
    balcony: z.number().nonnegative().optional(),
    floorLevel: z.string().optional(),
    gas: z.string().optional(),
    parking: z.string().optional(),
    lift: z.string().optional(),
    furnished: z.string().optional(),
    facing: z.string().optional(),
    serviceCharge: z.number().nonnegative().optional(),
    availableFrom: z.string().datetime().optional(),
    amenities: z.array(z.string()).optional(),
    videoLink: z.string().url().optional(),
    newBuild: z.string().optional(),
    propertyType: z.string().optional(),
    image: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    isAvailable: z.boolean().optional(),
  }),
});

export const PropertyValidation = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};