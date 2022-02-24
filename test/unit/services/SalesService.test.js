const sinon = require('sinon');
const { expect } = require('chai');

const { SalesModel } = require('../../../models');
const { SalesService } = require('../../../services');

describe('Sales Service tests', () => {
  describe('get all Sales', () => {
    describe('when response returns all Sales', () => {
      const getAllResponse = [
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
      ];
  
      before(() => {
        sinon.stub(SalesModel, 'getAll').resolves(getAllResponse);
      });
  
      after(() => {
        SalesModel.getAll.restore();
      });
  
      it('Should return an array not empty', async () => {
        const getAll = await SalesService.getAll();
  
        expect(getAll.data).to.be.an('array');
        expect(getAll.data).to.be.not.empty;
      });
  
      it('Should return an array of objects', async () => {
        const getAll = await SalesService.getAll();

        expect(getAll.data[0]).to.be.an('object');
        expect(getAll.data[1]).to.be.an('object');
      });
  
      it('Should return status code "200"', async () => {
        const getAll = await SalesService.getAll();
  
        expect(getAll.code).to.be.equal(200);
      });
  
      it('Objects should have the following properties: "saleId", "date", "productId", "quantity"', async () => {
        const getAll = await SalesService.getAll();
  
        expect(getAll.data[0]).to.include.all.keys('saleId', 'date', 'productId', 'quantity');
        expect(getAll.data[1]).to.include.all.keys('saleId', 'date', 'productId', 'quantity');
      });
    });

    describe('when Sales are not found', () => {
      const getAllResponse = [];
  
      before(() => {
        sinon.stub(SalesModel, 'getAll').resolves(getAllResponse);
      });
  
      after(() => {
        SalesModel.getAll.restore();
      });

      it('Should return status code "404"', async () => {
        const getAll = await SalesService.getAll();

        expect(getAll.code).to.be.equal(404);
      });

      it('Should return error message "Sales not found"', async () => {
        const getAll = await SalesService.getAll();

        expect(getAll.message).to.be.equal('Sales not found');
      });
    });
  });

  describe('get sales by ID', () => {
    describe('When the sales is found', () => {
      const id = 1;
      const getByIdResponse = [
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
      ];

      before(() => {
        sinon.stub(SalesModel, 'getById').resolves(getByIdResponse);
      });

      after(() => {
        SalesModel.getById.restore();
      });

      it('Should return with status code "200"', async () => {
        const sales = await SalesService.getById(id);

        expect(sales.code).to.be.equal(200);
      });

      it('Should return an array with two sales', async () => {
        const sales = await SalesService.getById(id);

        expect(sales.data).to.be.an('array');
        expect(sales.data).to.be.not.empty;
        expect(sales.data).to.be.have.length(2);
      });

      it('Should return an array with an object', async () => {
        const sales = await SalesService.getById(id);

        expect(sales.data[0]).to.be.an('object');
      });

      it('sales object should have the following properties: "date", "productId", "quantity"', async () => {
        const sales = await SalesService.getById(id);
  
        expect(sales.data[0]).to.include.all.keys('date', 'productId', 'quantity');
      });
  
      it('sales object returned should be deep equal the sales searched', async () => {
        const sales = await SalesService.getById(id);

        expect(sales.data).to.be.deep.equal(getByIdResponse);
      });
    });

    describe('When the sales is not found', () => {
      const id = 5;
      const getByIdResponse = [];
  
      before(() => {
        sinon.stub(SalesModel, 'getById').resolves(getByIdResponse);
      });
  
      after(() => {
        SalesModel.getById.restore();
      });

      it('Should not return data', async () => {
        const sales = await SalesService.getById(id);

        expect(!sales.data).to.be.true;
      });

      it('Should return with status code "404"', async () => {
        const sales = await SalesService.getById(id);

        expect(sales.code).to.be.equal(404);
      });

      it('Should return with error message "Sale not found"', async () => {
        const sales = await SalesService.getById(id);

        expect(sales.message).to.be.equal('Sale not found');
      });
    });
  });
});