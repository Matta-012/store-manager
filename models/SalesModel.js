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

const createSalesProducts = async ({ insertId, productId, quantity }) => {
  const query = `
    INSERT INTO
      StoreManager.sales_products (sale_id, product_id, quantity)
    VALUES(?, ?, ?);`;
  
  await connection.execute(query, [insertId, productId, quantity]);

  return {};
};

module.exports = {
  getAll,
  getById,
  createSale,
  createSalesProducts,
};
