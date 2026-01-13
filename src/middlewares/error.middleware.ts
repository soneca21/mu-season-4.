import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../logger/logger.js';

/**
 * Error middleware centralizado
 * Mapeia erros para formato padrão com código e mensagem
 * Loga estruturadamente com requestId e stack (apenas para INTERNAL_ERROR)
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
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = req.id || 'unknown';

  // Zod validation error
  if (error instanceof ZodError) {
    logger.debug(
      { requestId, code: 'VALIDATION_ERROR', details: error.errors },
      'Validation error'
    );
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
    logger.debug(
      { requestId, code: 'NOT_FOUND' },
      'Resource not found'
    );
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
    } as AppError);
  }

  // Prisma client error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.warn(
      { requestId, code: 'INTERNAL_ERROR', dbError: error.message },
      'Database error'
    );
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Database error',
      },
    } as AppError);
  }

  // Generic internal error (log com stack)
  logger.error(
    {
      requestId,
      code: 'INTERNAL_ERROR',
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    },
    'Unhandled error'
  );
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  } as AppError);
}
