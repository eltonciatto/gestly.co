export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string, details?: any) {
    return new AppError(message, 'bad_request', 400, details);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new AppError(message, 'unauthorized', 401);
  }

  static forbidden(message: string = 'Forbidden') {
    return new AppError(message, 'forbidden', 403);
  }

  static notFound(message: string = 'Not found') {
    return new AppError(message, 'not_found', 404);
  }

  static conflict(message: string) {
    return new AppError(message, 'conflict', 409);
  }

  static tooManyRequests(message: string = 'Too many requests') {
    return new AppError(message, 'rate_limit_exceeded', 429);
  }
}