const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    return res
      .status(400)
      .json({ message: "Data validation error", errors: err.errors });
  }

  if (err instanceof AuthorizationError) {
    return res.status(403).json({ message: "Authorization error" });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({ message: "Authentication error" });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({ message: "Conflict error" });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
};

module.exports = { errorHandler, notFoundHandler };
