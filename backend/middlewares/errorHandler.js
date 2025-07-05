const createError = require("http-errors");

exports.notFound = (req, res, next) => {
  next(createError(404, "Route not found"));
};

exports.errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};