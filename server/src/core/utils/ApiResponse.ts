class ApiResponse<T> {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T;

  constructor(statusCode: number, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
