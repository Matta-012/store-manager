module.exports = (err, _req, res, _next) => {
  console.error({ message: err.message });

  res.status(500).json({ message: err.message });
};
