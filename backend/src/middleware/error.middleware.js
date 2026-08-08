export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  console.error("=== GLOBAL ERROR HANDLER ===");
  console.error(err);
  console.error("============================");

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};