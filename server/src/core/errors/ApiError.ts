class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors?: unknown[];

  constructor(statusCode: number, message: string, errors: unknown[] = []) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
