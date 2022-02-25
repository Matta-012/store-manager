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

const getByName = async (name) => {
  const query = 'SELECT id, name, quantity FROM StoreManager.products WHERE name = ?;';
  const [result] = await connection.execute(query, [name]);

  return result.length < 1;
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

const update = async ({ id, name, quantity }) => {
  const query = 'UPDATE StoreManager.products SET name = ?, quantity = ? WHERE id = ?;';
  await connection.execute(query, [name, quantity, id]);

  return {
    id,
    name,
    quantity,
  };
};

module.exports = {
  getAll,
  getById,
  getByName,
  create,
  update,
};
