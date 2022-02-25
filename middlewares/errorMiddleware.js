module.exports = (err, _req, res, _next) => {
  console.error(err.message);

  if (err.statusCode) {
    res.status(err.statusCode).send(err.message);
  }

  res.status(500).send(err.message);
};
