class AppError extends Error {
  public statusCode: number;
  public success: boolean;

  constructor(statusCode: number, message: string) {
    super(message); // Call the parent Error constructor with the message
    this.statusCode = statusCode;
    this.success = `${statusCode}`.startsWith("2");

    // Ensure the correct stack trace is maintained for V8 engines (e.g., Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
