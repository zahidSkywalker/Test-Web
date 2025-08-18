function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || 'Server error',
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
}

module.exports = { errorHandler };

