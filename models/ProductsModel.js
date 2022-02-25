const camelcaseKeys = require('camelcase-keys');
const connection = require('./connection');

const getAll = async () => {
  const query = 'SELECT id, name, quantity FROM StoreManager.products ORDER BY id;';
  const [result] = await connection.execute(query);

  const serialize = camelcaseKeys(result);
  return serialize;
};

const getById = async (id) => {
  const query = 'SELECT id, name, quantity FROM StoreManager.products WHERE id = ? ORDER BY id;';
  const [result] = await connection.execute(query, [id]);

  const serialize = camelcaseKeys(result);
  return serialize[0];
};

const create = async ({ name, quantity }) => {
  const query = 'INSERT INTO StoreManager.products (name, quantity) VALUES (?, ?);';
  const [result] = await connection.execute(query, [name, quantity]);

  return {
    id: result.insertId,
    name,
    quantity,
  };
};

module.exports = {
  getAll,
  getById,
  create,
};
