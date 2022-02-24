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

  return result;
};

const getById = async (id) => {
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
  WHERE
    SP.sale_id = ?
  ORDER BY
    SP.sale_id, SP.sale_id;`;

  const [result] = await connection.execute(query, [id]);

  return result;
};

module.exports = {
  getAll,
  getById,
};
