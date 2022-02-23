const sinon = require('sinon');
const { expect } = require('chai');

const connection = require('../../../models/connection');
const { ProductsService } = require('../../../services');

describe('Products Service tests', () => {
  describe('get all Products', () => {
    const getAllResponse = [
      [
        {
          "id": 1,
          "name": "produto A",
          "quantity": 10
        },
        {
          "id": 2,
          "name": "produto B",
          "quantity": 20
        }
      ]
    ];

    before(() => {
      sinon.stub(connection, 'execute').resolves(getAllResponse);
    });

    after(() => {
      connection.execute.restore();
    });

    it('Returns an array not empty', async () => {
      const getAll = await ProductsService.getAll();

      expect(getAll).to.be.an('array');
      expect(getAll).to.be.not.empty;
    });

    it('Returns an array of objects', async () => {
      const getAll = await ProductsService.getAll();

      expect(getAll[0]).to.be.an('object');
      expect(getAll[1]).to.be.an('object');
    });

    it('Objects have the following properties: "id", "name", "quantity"', async () => {
      const getAll = await ProductsService.getAll();

      expect(getAll[0]).to.include.all.keys('id', 'name', 'quantity');
      expect(getAll[1]).to.include.all.keys('id', 'name', 'quantity');
    });
  });
});