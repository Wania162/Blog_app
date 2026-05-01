const errorHandler = (err, req, res, next) => {
  let status  = err.statusCode || 500;
  let message = err.message    || 'Server error';

  if (err.name === 'CastError')         { status = 404; message = 'Resource not found'; }
  if (err.code === 11000)               { status = 400; message = `${Object.keys(err.keyValue)[0]} already exists`; }
  if (err.name === 'ValidationError')   { status = 400; message = Object.values(err.errors).map(e => e.message).join(', '); }
  if (err.name === 'JsonWebTokenError') { status = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError') { status = 401; message = 'Token expired'; }

  console.error(`[ERROR] ${status}: ${message}`);
  res.status(status).json({ success: false, message });
};

const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };