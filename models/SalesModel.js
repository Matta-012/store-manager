const camelcaseKeys = require('camelcase-keys');
const connection = require('./connection');

const getAll = async () => {
  const query = `
  SELECT
    SP.sale_id,
    SP.product_id,
    SP.quantity,
    S.date
  FROM
    StoreManager.sales_products AS SP
  INNER JOIN
    StoreManager.sales AS S
  ON S.id = SP.sale_id
  ORDER BY
    SP.sale_id, SP.sale_id;`;

  const [result] = await connection.execute(query);

  const serialize = camelcaseKeys(result);
  return serialize;
};

const getByIdAndProductId = async ({ id, productId }) => {
  const query = `
  SELECT
    SP.product_id,
    SP.quantity,
    S.date
  FROM
    StoreManager.sales_products AS SP
  INNER JOIN
    StoreManager.sales AS S
    ON S.id = SP.sale_id
  WHERE
    SP.sale_id = ? AND SP.product_id = ?
  ORDER BY
    SP.sale_id, SP.sale_id;`;

  const [result] = await connection.execute(query, [id, productId]);

  const serialize = camelcaseKeys(result);
  return serialize.length > 0 ? serialize[0] : null;
};

const getById = async (id) => {
  const query = `
  SELECT
    SP.product_id,
    SP.quantity,
    S.date
  FROM
    StoreManager.sales_products AS SP
  INNER JOIN
    StoreManager.sales AS S
    ON S.id = SP.sale_id
  WHERE
    SP.sale_id = ?
  ORDER BY
    SP.sale_id, SP.sale_id;`;

  const [result] = await connection.execute(query, [id]);

  const serialize = camelcaseKeys(result);
  return serialize;
};

const createSale = async () => {
  const query = 'INSERT INTO StoreManager.sales (date) VALUES(now());';

  const [{ insertId }] = await connection.execute(query);

  return insertId;
};

const createSalesProducts = async ({ saleId, productId, quantity }) => {
  const query = `
    INSERT INTO
      StoreManager.sales_products (sale_id, product_id, quantity)
    VALUES(?, ?, ?);`;
  
  await connection.execute(query, [saleId, productId, quantity]);

  return null;
};

const update = async ({ id, productId, quantity }) => {
  const query = `
    UPDATE
      StoreManager.sales_products 
    SET 
      quantity = ?
    WHERE
      sale_id = ? AND product_id = ?;`;

  const [result] = await connection.execute(query, [quantity, id, productId]);

  return result.affectedRows === 0 ? null : { productId, quantity };
};

const deleteSale = async (id) => {
  const query = 'DELETE FROM StoreManager.sales WHERE id = ?;';
  const [result] = await connection.execute(query, [id]);

  return result.affectedRows !== 0;
};

module.exports = {
  getAll,
  getById,
  getByIdAndProductId,
  createSale,
  createSalesProducts,
  update,
  deleteSale,
};
