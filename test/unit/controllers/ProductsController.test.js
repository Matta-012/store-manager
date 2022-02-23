const sinon = require('sinon');
const { expect } = require('chai');

const { ProductsController } = require('../../../controllers');
const { ProductsService } = require('../../../services');

describe('Products Controller tests', () => {
  const request = {};
  const response = {};

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns()
    next = sinon.stub().returns();
  });

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
      sinon.stub(ProductsService, 'getAll').resolves(getAllResponse);
    });

    after(() => {
      ProductsService.getAll.restore();
    });

    it('Response status code is 200', async () => {
      await ProductsController.getAll(request, response, next);

      expect(response.status.calledWith(200)).to.be.true;
    });

    it('Response json returns expected data from database', async () => {
      await ProductsController.getAll(request, response, next);

      expect(response.json.calledWith(getAllResponse)).to.be.true;
    });
  });
});