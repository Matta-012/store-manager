module.exports = (err, _req, res, _next) => {
  console.error({ message: err.message });

  if (err.statusCode) {
    res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({ message: err.message });
};
