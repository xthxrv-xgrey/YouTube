class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = stack;
    this.success = false;
    this.data = null;
    this.isOperational = true;
  }
}

export { ApiError };
