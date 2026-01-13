import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Error middleware centralizado
 * Mapeia erros para formato padrão com código e mensagem
 */

export interface AppError {
  error: {
    code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'INTERNAL_ERROR' | 'UNAUTHORIZED';
    message: string;
    details?: unknown;
  };
}

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation error
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.errors,
      },
    } as AppError);
  }

  // Prisma not found error
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
    } as AppError);
  }

  // Prisma client error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Database error',
      },
    } as AppError);
  }

  // Generic internal error
  console.error('Unhandled error:', error instanceof Error ? error.message : String(error));
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  } as AppError);
}
