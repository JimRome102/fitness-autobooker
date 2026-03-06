import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_CREDENTIAL = 'DUPLICATE_CREDENTIAL',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  AUTOMATION_ERROR = 'AUTOMATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    // Operational error - send to client
    logger.error(`${err.code}: ${err.message}`, {
      statusCode: err.statusCode,
      details: err.details
    });

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details })
      }
    });
  } else {
    // Unexpected error - log and send generic message
    logger.error('Unexpected error:', err);

    res.status(500).json({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'An unexpected error occurred'
      }
    });
  }
}
