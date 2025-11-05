class CustomError extends Error {
  constructor(message, statusCode, err) {
    super(message);
    this.statusCode = statusCode || 500;
    if (err) {
      this.originalError = err;
      this.stack = err.stack || this.stack;
      this.name = err.name || this.name;
    }
  }
}

module.exports = CustomError;