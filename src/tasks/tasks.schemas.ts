import { z } from 'zod';

/**
 * Schemas Zod para validação de payloads de Task
 */

export const CreateTaskSchema = z.object({
  title: z.string().trim().min(1, 'title required').max(200, 'title max 200 chars'),
  description: z.string().max(2000, 'description max 2000 chars').nullable().optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(['todo', 'doing', 'done']).optional(),
}).refine((obj) => Object.keys(obj).length > 0, 'at least one field required');

export const TaskResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(['todo', 'doing', 'done']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
