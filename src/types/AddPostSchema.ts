import { z } from 'zod';

export const AddPostSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string().min(1)
});
