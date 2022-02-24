const connection = require('./connection');

const getAll = async () => {
  const query = 'SELECT id, name, quantity FROM products;';
  const [result] = await connection.execute(query);

  return result;
};

const getById = async (id) => {
  const query = 'SELECT id, name, quantity FROM products WHERE id = ?;';
  const [result] = await connection.execute(query, [id]);

  return result;
};

module.exports = {
  getAll,
  getById,
};
