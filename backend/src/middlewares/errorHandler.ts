// // backend/src/middlewares/errorHandler.ts
// import { Request, Response, NextFunction } from 'express';
// import { logger } from '../utils/logger';

// export class AppError extends Error {
//   statusCode: number;
//   isOperational: boolean;
  
//   constructor(message: string, statusCode: number) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = true;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

// export class ValidationError extends AppError {
//   constructor(message: string) {
//     super(message, 400);
//     this.name = 'ValidationError';
//   }
// }

// export class NotFoundError extends AppError {
//   constructor(message: string) {
//     super(message, 404);
//     this.name = 'NotFoundError';
//   }
// }

// export class AuthenticationError extends AppError {
//   constructor(message: string = 'Authentication required') {
//     super(message, 401);
//     this.name = 'AuthenticationError';
//   }
// }

// export class AuthorizationError extends AppError {
//   constructor(message: string = 'Insufficient permissions') {
//     super(message, 403);
//     this.name = 'AuthorizationError';
//   }
// }

// export const errorHandler = (
//   err: Error | AppError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // Log error
//   logger.error(`${err.name}: ${err.message}`, {
//     path: req.path,
//     method: req.method,
//     ip: req.ip,
//     userId: (req as any).user?.id,
//     stack: err.stack
//   });

//   // Handle known errors
//   if (err instanceof AppError) {
//     return res.status(err.statusCode).json({
//       success: false,
//       error: err.message,
//       code: err.name
//     });
//   }

//   // Handle Prisma errors
//   if (err.name === 'PrismaClientKnownRequestError') {
//     return res.status(400).json({
//       success: false,
//       error: 'Database error occurred',
//       code: 'DATABASE_ERROR'
//     });
//   }

//   // Handle JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({
//       success: false,
//       error: 'Invalid token',
//       code: 'INVALID_TOKEN'
//     });
//   }

//   if (err.name === 'TokenExpiredError') {
//     return res.status(401).json({
//       success: false,
//       error: 'Token expired',
//       code: 'TOKEN_EXPIRED'
//     });
//   }

//   // Default error
//   const isDevelopment = process.env.NODE_ENV === 'development';
//   res.status(500).json({
//     success: false,
//     error: isDevelopment ? err.message : 'Internal server error',
//     code: 'INTERNAL_ERROR',
//     ...(isDevelopment && { stack: err.stack })
//   });
// };

// // Async wrapper to catch errors
// export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };








// backend/src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: (req as any).user?.id,
    stack: err.stack
  });

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.name
    });
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      error: 'Database error occurred',
      code: 'DATABASE_ERROR'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
    details: err.message || undefined
  });
};

// Async wrapper to catch errors
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};