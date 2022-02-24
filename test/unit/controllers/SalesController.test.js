const sinon = require('sinon');
const { expect } = require('chai');

const { SalesController } = require('../../../controllers');
const { SalesService } = require('../../../services');

describe('Sales Controller tests', () => {
  const request = {};
  const response = {};
  let next = () => {};

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns()
    next = sinon.stub().returns();
  });

  describe('get all Sales', () => {
    describe('when all Sales are found', () => {
      const getAllResponse = {
        code: 200,
        data: [
          {
            "saleId": 1,
            "date": "2021-09-09T04:54:29.000Z",
            "productId": 1,
            "quantity": 2
          },
          {
            "saleId": 1,
            "date": "2021-09-09T04:54:54.000Z",
            "productId": 2,
            "quantity": 2
          }
        ],
      };

      before(() => {
        sinon.stub(SalesService, 'getAll').resolves(getAllResponse);
      });

      after(() => {
        SalesService.getAll.restore();
      });

      it('Should respond with status code "200"', async () => {
        await SalesController.getAll(request, response, next);

        expect(response.status.calledWith(getAllResponse.code)).to.be.true;
      });

      it('Response json should return expected data from database', async () => {
        await SalesController.getAll(request, response, next);

        expect(response.json.calledWith(getAllResponse.data)).to.be.true;
      });
    });

    describe('when all Sales are not found', () => {
      const getAllResponse = {
        code: 404,
        message: 'Sales not found',
      };

      before(() => {
        sinon.stub(SalesService, 'getAll').resolves(getAllResponse);
      });

      after(() => {
        SalesService.getAll.restore();
      });

      it('Should respond with status code "404"', async () => {
        await SalesController.getAll(request, response, next);

        expect(response.status.calledWith(getAllResponse.code)).to.be.true;
      });

      it('Response json should return error message "Sales not found"', async () => {
        await SalesController.getAll(request, response, next);

        expect(response.json.calledWith(getAllResponse.message)).to.be.true;
      });
    });
  });

  describe('get Sales by ID', () => {
    describe('When response returns the Product', () => {
      const id = 1;
      const getByIdResponse = {
        code: 200,
        data: [
          {
            "date": "2021-09-09T04:54:29.000Z",
            "productId": 1,
            "quantity": 2
          },
          {
            "date": "2021-09-09T04:54:54.000Z",
            "productId": 2,
            "quantity": 2
          }
        ],
      };

      before(() => {
        request.params = { id };
        sinon.stub(SalesService, 'getById').resolves(getByIdResponse);
      });

      after(() => {
        SalesService.getById.restore();
      });

      it('Should respond with status code "200"', async () => {
        await SalesController.getById(request, response, next);

        expect(response.status.calledWith(getByIdResponse.code)).to.be.true;
      });

      it('Response json should return expected data from database', async () => {
        await SalesController.getById(request, response, next);

        expect(response.json.calledWith(getByIdResponse.data)).to.be.true;
      });
    });

    describe('When the sale is not found', () => {
      const id = 10;
      const getByIdResponse = {
        code: 404,
        message: 'Sale not found',
      };

      before(() => {
        request.params = { id };
        sinon.stub(SalesService, 'getById').resolves(getByIdResponse);
      });

      after(() => {
        SalesService.getById.restore();
      });

      it('Should respond with status code "404"', async () => {
        await SalesController.getById(request, response, next);

        expect(response.status.calledWith(getByIdResponse.code)).to.be.true;
      });

      it('Response json should return error message "Sale not found"', async () => {
        await SalesController.getById(request, response, next);

        expect(response.json.calledWith(getByIdResponse.message)).to.be.true;
      });
    });
  });
});