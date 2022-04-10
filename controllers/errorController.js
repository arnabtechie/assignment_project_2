const sendError = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(500).json({
      status: err.status,
      errors: err.stack,
    });
  }
};

export default (err, req, res, next) => {
  err.status = "fail";

  sendError(err, req, res);
};
