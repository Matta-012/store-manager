const connection = require('./connection');

const getAll = async () => {
  const query = 'SELECT id, name, quantity FROM StoreManager.products ORDER BY id;';
  const [result] = await connection.execute(query);

  return result;
};

const getById = async (id) => {
  const query = 'SELECT id, name, quantity FROM StoreManager.products WHERE id = ? ORDER BY id;';
  const [result] = await connection.execute(query, [id]);

  return result[0];
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
  const [result] = await connection.execute(query, [name, quantity, id]);

  return result.affectedRows === 0 ? null : { id, name, quantity };
};

const updateQuantity = async ({ productId, quantity }) => {
  const query = 'UPDATE StoreManager.products SET quantity = ? WHERE id = ?;';
  const [result] = await connection.execute(query, [quantity, productId]);

  return result.affectedRows !== 0;
};

const deleteProduct = async (id) => {
  const query = 'DELETE FROM StoreManager.products WHERE id = ?;';
  const [result] = await connection.execute(query, [id]);

  return result.affectedRows !== 0;
};

module.exports = {
  getAll,
  getById,
  getByName,
  create,
  update,
  deleteProduct,
  updateQuantity,
};
