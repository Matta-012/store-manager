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
    response.json = sinon.stub().returns();
    response.end = sinon.stub().returns();
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

        expect(response.json.calledWith({ message: getAllResponse.message })).to.be.true;
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

        expect(response.json.calledWith({ message: getByIdResponse.message })).to.be.true;
      });
    });
  });

  describe('Create new Sale', () => {
    describe('When a new sale is created', () => {
      const createResponse = {
        code: 201,
        data: { 
          id: 1, 
          itemsSold: [
            {
              "productId": 1,
              "quantity": 100
            }
          ]
        }
      };

      before(() => {
        request.body = [
          {
            "productId": 1,
            "quantity": 10
          }
        ];
        sinon.stub(SalesService, 'create').resolves(createResponse);
      });

      after(() => {
        SalesService.create.restore();
      });

      it('Should respond with status code "201"', async () => {
        await SalesController.create(request, response, next);

        expect(response.status.calledWith(createResponse.code)).to.be.true;
      });

      it('Response json should return expected data from database', async () => {
        await SalesController.create(request, response, next);

        expect(response.json.calledWith(createResponse.data)).to.be.true;
      });
    });

    describe('When no data is provided to create a new sale', () => {
      const createResponse = {
        code: 404,
        message: 'Product not found',
      };

      before(() => {
        request.body = [];
        sinon.stub(SalesService, 'create').resolves(createResponse);
      });

      after(() => {
        SalesService.create.restore();
      });

      it('Should respond with status code "400"', async () => {
        await SalesController.create(request, response, next);

        expect(response.status.calledWith(400)).to.be.true;
      });

      it('Response json should return error message "Bad request"', async () => {
        await SalesController.create(request, response, next);

        expect(response.json.calledWith({ message: 'Bad request' })).to.be.true;
      });
    });

    describe('When the product ID is not found to update the inventory', () => {
      const createResponse = {
        code: 404,
        message: 'Product not found',
      };

      before(() => {
        request.body = [
          {
            "productId": 999,
            "quantity": 10
          }
        ];
        sinon.stub(SalesService, 'create').resolves(createResponse);
      });

      after(() => {
        SalesService.create.restore();
      });

      it('Should respond with status code "404"', async () => {
        await SalesController.create(request, response, next);

        expect(response.status.calledWith(createResponse.code)).to.be.true;
      });

      it('Response json should return error message "Product not found"', async () => {
        await SalesController.create(request, response, next);

        expect(response.json.calledWith({ message: createResponse.message })).to.be.true;
      });
    });
  });

  describe('Update a Sale', () => {
    describe('When the sale is updated', () => {
      const updateResponse = { 
        code: 200,
        data: { 
          saleId: 1,
          itemUpdated: [{
            "productId": 1,
            "quantity": 10
          }], 
        }
      };

      before(() => {
        request.params = { id: 1 };
        request.body = [
          {
            "productId": 1,
            "quantity": 10
          }
        ];
        sinon.stub(SalesService, 'update').resolves(updateResponse);
      });

      after(() => {
        SalesService.update.restore();
      });

      it('Should respond with status code "200"', async () => {
        await SalesController.update(request, response, next);

        expect(response.status.calledWith(updateResponse.code)).to.be.true;
      });

      it('Response json should return expected data from database', async () => {
        await SalesController.update(request, response, next);

        expect(response.json.calledWith(updateResponse.data)).to.be.true;
      });
    });

    describe('When no data is provided to update a new sale', () => {
      const updateResponse = { code: 404, message: 'Sale not found' };

      before(() => {
        request.params = { id: 1 };
        request.body = [];
        sinon.stub(SalesService, 'update').resolves(updateResponse);
      });

      after(() => {
        SalesService.update.restore();
      });

      it('Should respond with status code "400"', async () => {
        await SalesController.update(request, response, next);

        expect(response.status.calledWith(400)).to.be.true;
      });

      it('Response json should return error message "Bad request"', async () => {
        await SalesController.update(request, response, next);

        expect(response.json.calledWith({ message: 'Bad request' })).to.be.true;
      });
    });

    describe('When the sale is not found', () => {
      const updateResponse = { code: 404, message: 'Sale not found' };

      before(() => {
        request.params = { id: 999 };
        request.body = [
          {
            "productId": 1,
            "quantity": 10
          }
        ];
        sinon.stub(SalesService, 'update').resolves(updateResponse);
      });

      after(() => {
        SalesService.update.restore();
      });

      it('Should respond with status code "404"', async () => {
        await SalesController.update(request, response, next);

        expect(response.status.calledWith(updateResponse.code)).to.be.true;
      });

      it('Response json should return error message "Sale not found"', async () => {
        await SalesController.update(request, response, next);

        expect(response.json.calledWith({ message: updateResponse.message })).to.be.true;
      });
    });
  });

  describe('Delete a Sale', () => {
    describe('When the sale is deleted', () => {
      const id = 1;
      const deleteResponse = {
        code: 204,
      };

      before(() => {
        request.params = { id };
        sinon.stub(SalesService, 'deleteSale').resolves(deleteResponse);
      });

      after(() => {
        SalesService.deleteSale.restore();
      });

      it('Should respond with status code "204"', async () => {
        await SalesController.deleteSale(request, response, next);

        expect(response.status.calledWith(deleteResponse.code)).to.be.true;
      });
    });

    describe('When the sale is not found', () => {
      const id = 999;
      const deleteResponse = {
        code: 404,
        message: 'Sale not found',
      }

      before(() => {
        request.params = { id };
        sinon.stub(SalesService, 'deleteSale').resolves(deleteResponse);
      });

      after(() => {
        SalesService.deleteSale.restore();
      });

      it('Should respond with status code "404"', async () => {
        await SalesController.deleteSale(request, response, next);

        expect(response.status.calledWith(deleteResponse.code)).to.be.true;
      });

      it('Response json should return error message "Sale not found"', async () => {
        await SalesController.deleteSale(request, response, next);

        expect(response.json.calledWith({ message: deleteResponse.message })).to.be.true;
      });
    });
  });
});