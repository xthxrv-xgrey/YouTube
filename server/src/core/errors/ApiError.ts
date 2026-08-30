class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: false;
  public readonly errors: unknown[];

  constructor(statusCode: number, message: string, errors: unknown[] = []) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
