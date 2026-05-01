const errorHandler = (err, req, res, next) => {
  let status  = err.statusCode || 500;
  let message = err.message    || 'Server error ho gaya';

  if (err.name === 'CastError')         { status = 404; message = 'Resource nahi mila'; }
  if (err.code === 11000)               { status = 400; message = `${Object.keys(err.keyValue)[0]} pehle se exist karta hai`; }
  if (err.name === 'ValidationError')   { status = 400; message = Object.values(err.errors).map(e => e.message).join(', '); }
  if (err.name === 'JsonWebTokenError') { status = 401; message = 'Token galat hai'; }
  if (err.name === 'TokenExpiredError') { status = 401; message = 'Token expire ho gaya'; }

  // Full error log karo
  console.error('=== FULL ERROR ===');
  console.error('Name:', err.name);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('==================');

  res.status(status).json({ 
    success: false, 
    message,
    error: err.message  // Railway logs mein dikhega
  });
};

const notFound = (req, res, next) => {
  const err = new Error(`Route nahi mila: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };