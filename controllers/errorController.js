const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrProd = (err, res) => {
  let errName;
  if (typeof err.message === 'string') {
    errName = 'errorMessage';
  } else {
    errName = 'errors';
  }

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      [errName]: err.message
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

// global error handler middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    sendErrProd(error, res);
  }
};
