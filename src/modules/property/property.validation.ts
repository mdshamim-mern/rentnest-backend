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
  }),
});

const updatePropertyValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().optional(),
  }),
});

export const PropertyValidation = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};