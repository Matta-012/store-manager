const sinon = require('sinon');
const { expect } = require('chai');

const connection = require('../../../models/connection');
const { SalesModel } = require('../../../models');

describe('Sales Model tests', () => {
  describe('get all Sales', () => {
    const getAllResponse = [
      [
        {
          "saleId": 1,
          "date": "2021-09-09T04:54:29.000Z",
          "saleId": 1,
          "quantity": 2
        },
        {
          "saleId": 1,
          "date": "2021-09-09T04:54:54.000Z",
          "saleId": 2,
          "quantity": 2
        }
      ]
    ];

    before(() => {
      sinon.stub(connection, 'execute').resolves(getAllResponse);
    });

    after(() => {
      connection.execute.restore();
    });

    it('Should return an array not empty', async () => {
      const getAllSales = await SalesModel.getAll();

      expect(getAllSales).to.be.an('array');
      expect(getAllSales).to.be.not.empty;
    });

    it('Should return an array of objects', async () => {
      const getAll = await SalesModel.getAll();

      expect(getAll[0]).to.be.an('object');
      expect(getAll[1]).to.be.an('object');
    });

    it('Objects should have the following properties: "saleId", "date", "saleId", "quantity"', async () => {
      const getAll = await SalesModel.getAll();

      expect(getAll[0]).to.include.all.keys('saleId', 'date', 'saleId', 'quantity');
      expect(getAll[1]).to.include.all.keys('saleId', 'date', 'saleId', 'quantity');
    });
  });

  describe('get sales by ID', () => {
    describe('When the sale is found', () => {
      const id = 1;
      const getByIdResponse = [
        [
          {
            "date": "2021-09-09T04:54:29.000Z",
            "saleId": 1,
            "quantity": 2
          },
          {
            "date": "2021-09-09T04:54:54.000Z",
            "saleId": 2,
            "quantity": 2
          }
        ]
      ];

      before(() => {
        sinon.stub(connection, 'execute').resolves(getByIdResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return an array with two sales', async () => {
        const sales = await SalesModel.getById(id);
  
        expect(sales).to.be.an('array');
        expect(sales).to.be.not.empty;
        expect(sales).to.be.have.length(2);
      });
  
      it('Should return an array with an object', async () => {
        const sales = await SalesModel.getById(id);
  
        expect(sales[0]).to.be.an('object');
      });
  
      it('Sale object should have the following properties: "saleId", "date", "saleId", "quantity"', async () => {
        const sale = await SalesModel.getById(id);
  
        expect(sale[0]).to.include.all.keys('saleId', 'date', 'saleId', 'quantity');
      });
  
      it('Sale object returned should be deep equal the sale searched', async () => {
        const sale = await SalesModel.getById(id);

        expect(sale).to.be.deep.equal(getByIdResponse[0]);
      });
    });

    describe('When the sale ID is not found', () => {
      const id = 10;
      const getByIdResponse = [[]];
  
      before(() => {
        sinon.stub(connection, 'execute').resolves(getByIdResponse);
      });
  
      after(() => {
        connection.execute.restore();
      });

      it('Should return an empty array', async () => {
        const sale = await SalesModel.getById(id);

        expect(sale).to.be.empty;
      });
    });
  });
});
