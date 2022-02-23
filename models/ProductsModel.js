const connection = require('./connection');

const getAll = async () => {
  const query = 'SELECT id, name, quantity FROM products';
  const [result] = await connection.execute(query);

  return result;
};

module.exports = {
  getAll,
};