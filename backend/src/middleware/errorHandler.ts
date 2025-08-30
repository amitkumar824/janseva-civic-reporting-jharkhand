import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error for debugging
  console.error(`Error ${statusCode}: ${message}`);
  console.error(error.stack);

  // Don't leak error details in production
  const responseMessage = process.env.NODE_ENV === 'production' 
    ? (statusCode === 500 ? 'Internal Server Error' : message)
    : message;

  res.status(statusCode).json({
    error: responseMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const notFound = (message: string = 'Resource not found') => createError(message, 404);
export const badRequest = (message: string = 'Bad request') => createError(message, 400);
export const unauthorized = (message: string = 'Unauthorized') => createError(message, 401);
export const forbidden = (message: string = 'Forbidden') => createError(message, 403);
export const conflict = (message: string = 'Conflict') => createError(message, 409);
export const internalServer = (message: string = 'Internal server error') => createError(message, 500);
