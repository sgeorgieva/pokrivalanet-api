class AppSuccess {
  constructor(message, statusCode, user) {
    // super();

    this.statusCode = statusCode;
    this.status = 'success';
    this.message = message;
    this.user = user;
    // Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppSuccess;