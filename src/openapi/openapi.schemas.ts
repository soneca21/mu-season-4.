import { z } from 'zod';

/**
 * Schemas OpenAPI derivados de Zod
 * Source of truth: estes esquemas são usados tanto no code quanto na documentação OpenAPI
 */

// Task schema (matches Prisma Task model)
export const TaskSchema = z.object({
  id: z.string().uuid().describe('Task ID (UUID)'),
  title: z.string().min(1).describe('Task title'),
  description: z.string().nullable().describe('Task description (optional)'),
  status: z
    .enum(['todo', 'doing', 'done'])
    .describe('Task status'),
  createdAt: z.string().datetime().describe('Creation timestamp'),
  updatedAt: z.string().datetime().describe('Last update timestamp'),
});

// Task list response
export const TaskListSchema = z.object({
  items: z.array(TaskSchema).describe('Array of tasks'),
  count: z.number().int().describe('Total number of tasks'),
});

// Create task input
export const CreateTaskSchema = z.object({
  title: z.string().min(1).describe('Task title (required)'),
  description: z
    .string()
    .optional()
    .describe('Task description (optional)'),
});

// Update task input
export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1)
    .optional()
    .describe('Task title (optional)'),
  description: z
    .string()
    .nullable()
    .optional()
    .describe('Task description (nullable, optional)'),
  status: z
    .enum(['todo', 'doing', 'done'])
    .optional()
    .describe('Task status (optional)'),
});

// Health check response
export const HealthSchema = z.object({
  status: z.literal('ok').describe('Health status'),
  uptime: z.number().describe('Server uptime in milliseconds'),
  timestamp: z.string().datetime().describe('Timestamp'),
});

// Error response (base)
export const ErrorDetailSchema = z.object({
  code: z
    .enum([
      'VALIDATION_ERROR',
      'NOT_FOUND',
      'INTERNAL_ERROR',
      'UNAUTHORIZED',
    ])
    .describe('Error code'),
  message: z.string().describe('Error message'),
  details: z.unknown().optional().describe('Additional error details'),
});

export const ErrorResponseSchema = z.object({
  error: ErrorDetailSchema,
});

// Typed exports for use in OpenAPI builder
export type Task = z.infer<typeof TaskSchema>;
export type TaskList = z.infer<typeof TaskListSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type Health = z.infer<typeof HealthSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
