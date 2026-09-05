export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly data?: unknown;

  constructor(message: string, statusCode = 500, isOperational = true, data?: unknown) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;
    Error.captureStackTrace?.(this, new.target);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', data?: unknown) {
    super(message, 400, true, data);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class BadGatewayError extends AppError {
  constructor(message = 'Bad gateway') {
    super(message, 502);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(message, 503);
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(message = 'Gateway timeout') {
    super(message, 504);
  }
}
