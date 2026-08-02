import { z } from 'zod';

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    password: z.string().min(6).optional(),
    bio: z.string().optional(),
    photo: z.string().optional(),
  }),
});

export const UserValidation = {
  updateProfileValidationSchema,
};