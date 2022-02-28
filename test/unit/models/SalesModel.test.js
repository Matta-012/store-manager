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
          "productId": 1,
          "quantity": 2
        },
        {
          "saleId": 1,
          "date": "2021-09-09T04:54:54.000Z",
          "productId": 2,
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

    it('Objects should have the following properties: "saleId", "date", "productId", "quantity"', async () => {
      const getAll = await SalesModel.getAll();

      expect(getAll[0]).to.include.all.keys('saleId', 'date', 'productId', 'quantity');
      expect(getAll[1]).to.include.all.keys('saleId', 'date', 'productId', 'quantity');
    });
  });

  describe('get sales by ID', () => {
    describe('When the sale is found', () => {
      const id = 1;
      const getByIdResponse = [
        [
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
  
      it('Sale object should have the following properties: "date", "productId", "quantity"', async () => {
        const sale = await SalesModel.getById(id);
  
        expect(sale[0]).to.include.all.keys('date', 'productId', 'quantity');
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

  describe('Get sales by ID and PRODUCT ID', () => {
    const id = 1;
    const productId = 1;

    describe('When the sale is found', () => {
      const getByIdResponse = [
        [
          {
            "date": "2021-09-09T04:54:29.000Z",
            "productId": 1,
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

      it('Should return an object', async () => {
        const sales = await SalesModel.getByIdAndProductId({ id, productId });

        expect(sales).to.be.an('object');
      });
  
      it('Sale object should have the following properties: "date", "productId", "quantity"', async () => {
        const sale = await SalesModel.getByIdAndProductId({ id, productId });
  
        expect(sale).to.include.all.keys('date', 'productId', 'quantity');
      });
  
      it('Sale object returned should be deep equal the sale searched', async () => {
        const sale = await SalesModel.getByIdAndProductId({ id, productId });

        expect(sale).to.be.deep.equal(getByIdResponse[0][0]);
      });
    });

    describe('When the sale ID or PRODUCT ID is not found', () => {
      const getByIdResponse = [[]];
  
      before(() => {
        sinon.stub(connection, 'execute').resolves(getByIdResponse);
      });
  
      after(() => {
        connection.execute.restore();
      });

      it('Should return null', async () => {
        const sale = await SalesModel.getByIdAndProductId({ id, productId });

        expect(sale).to.be.null;
      });
    });
  });

  describe('Create new Sale into Sales table', () => {
    const createSaleResponse = [{ insertId: 1 }];

    before(() => {
      sinon.stub(connection, 'execute').resolves(createSaleResponse);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('When the sale is created', () => {
      it('Should return the ID of the created sale', async () => {
        const insertId = await SalesModel.createSale();

        expect(typeof insertId).to.be.equal('number');
        expect(insertId).to.be.equal(1);
      });
    });
  });

  describe('Create new Sale into Sales Products table', () => {
    const createSaleResponse = [null];
    const input = {
      "saleId": 1,
      "productId": 1,
      "quantity": 2
    }

    before(() => {
      sinon.stub(connection, 'execute').resolves(createSaleResponse);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('When the sale is created', () => {
      it('Should return null', async () => {
        const modelResponse = await SalesModel.createSalesProducts(input);

        expect(modelResponse).to.be.null;
      });
    });
  });

  describe('Update a sale into Sales Products table', () => {
    const input = {
      "id": 1,
      "productId": 1,
      "quantity": 2
    }
    describe('When the sale is updated', () => {
      const updateSaleResponse = [
        {
          "productId": 1,
          "quantity": 2
        }
      ];

      before(() => {
        sinon.stub(connection, 'execute').resolves(updateSaleResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Response object should have the following properties: "productId", "quantity"', async () => {
        const sale = await SalesModel.update(input);

        expect(sale).to.include.all.keys('productId', 'quantity');
      });

      it('Response object should be deep equal the sale updated', async () => {
        const sale = await SalesModel.update(input);

        expect(sale).to.be.deep.equal({ "productId": 1, "quantity": 2 });
      });
    });

    describe('When the sale is not updated', () => {
      const updateSaleResponse = [{ affectedRows: 0 }];

      before(() => {
        sinon.stub(connection, 'execute').resolves(updateSaleResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return null', async () => {
        const sale = await SalesModel.update(input);

        expect(sale).to.be.null;
      });
    });
  });

  describe('Delete a sale from sales table', () => {
    describe('When the sale is deleted', () => {
      const deleteSaleResponse = [{ affectedRows: 1 }];

      before(() => {
        sinon.stub(connection, 'execute').resolves(deleteSaleResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return true', async () => {
        const modelResponse = await SalesModel.deleteSale(1);

        expect(modelResponse).to.be.true;
      });
    });

    describe('When the sale is NOT deleted', () => {
      const deleteSaleResponse = [{ affectedRows: 0 }];

      before(() => {
        sinon.stub(connection, 'execute').resolves(deleteSaleResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return false', async () => {
        const modelResponse = await SalesModel.deleteSale(1);

        expect(modelResponse).to.be.false;
      });
    });
  });
});
