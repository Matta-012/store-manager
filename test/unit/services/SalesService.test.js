const sinon = require('sinon');
const { expect } = require('chai');

const { SalesModel, ProductsModel } = require('../../../models');
const { SalesService, ProductsService } = require('../../../services');
const validateProducts = require('../../../utils/validateProduct');
const handleInventory = require('../../../utils/updateInventory');

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

  describe('Create a new sales', () => {
    describe('When the sales is created', () => {
      const insertId = 1;
      const getByIdResponse = {
        "id": 1,
        "name": "Martelo de Thor",
        "quantity": 10
      };

      const input = [
        {
          "productId": 1,
          "quantity": 5
        },
      ];

      before(() => {
        sinon.stub(SalesModel, 'createSale').resolves(insertId);
        sinon.stub(SalesModel, 'createSalesProducts').resolves(null);
        sinon.stub(ProductsModel, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'updateQuantity').resolves(true);
      });

      after(() => {
        SalesModel.createSale.restore();
        SalesModel.createSalesProducts.restore();
        ProductsModel.getById.restore();
        ProductsModel.updateQuantity.restore();
      });

      it('Should return with status code "201"', async () => {
        const sales = await SalesService.create(input);

        expect(sales.code).to.be.equal(201);
      });

      it('"data" key should have the following properties: "id", "itemsSold"', async () => {
        const sales = await SalesService.create(input);

        expect(sales.data).to.include.all.keys('id', 'itemsSold');
      });

      it('"itemsSold" should be an array with a length of 1', async () => {
        const sales = await SalesService.create(input);

        expect(sales.data.itemsSold).to.be.an('array');
        expect(sales.data.itemsSold).to.be.have.length(1);
      });

      it('"itemsSold" inner objects should have the following properties: "productId", "quantity"', async () => {
        const sales = await SalesService.create(input);
  
        expect(sales.data.itemsSold[0]).to.include.all.keys('productId', 'quantity');
      });
  
      it('"itemsSold" returned array should be deep equal the sales created', async () => {
        const sales = await SalesService.create(input);

        expect(sales.data.itemsSold).to.be.deep.equal(input);
      });
    });

    describe('When the product to be sold is not found', () => {
      const getByIdResponse = [];

      const validation = {
        "productError": {
          "code": 404,
          "message": 'Product not found',
        },
        "quantityError": {},
        "products": [],
      };

      const serviceResponse = {
        "code": 404,
        "message": 'Product not found',
      };

      const input = [
        {
          "productId": 999,
          "quantity": 5
        },
      ];

      before(() => {
        sinon.stub(SalesModel, 'createSale').resolves(undefined);
        sinon.stub(SalesModel, 'createSalesProducts').resolves(null);
        sinon.stub(ProductsModel, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'updateQuantity').resolves(false);
        sinon.stub(ProductsService, 'getById').resolves(serviceResponse);
        sinon.stub(validateProducts, 'validateProduct').resolves(validation);
      });

      after(() => {
        validateProducts.validateProduct.restore();
        ProductsModel.getById.restore();
        SalesModel.createSale.restore();
        SalesModel.createSalesProducts.restore();
        ProductsModel.updateQuantity.restore();
        ProductsService.getById.restore();
      });

      it('Should return with status code "404" and the message "Product not found"', async () => {
        const sales = await SalesService.create(input);

        expect(sales.code).to.be.equal(404);
        expect(sales.message).to.be.equal('Product not found');
      });
    });
    
    describe('When the amount to be sold is bigger the inventory', () => {
      const validation = {
        "productError": {},
        "quantityError": {
          "code": 422,
          "message": 'Such amount is not permitted to sell'
        },
        "products": [],
      };

      const serviceResponse = {
        code: 200,
        data: {
          "id": 1,
          "name": "xablau2",
          "quantity": 10
        }
      };

      const modelResponse = {
        "id": 1,
        "name": "xablau2",
        "quantity": 10
      };

      const input = [
        {
          "productId": 1,
          "quantity": 999
        },
      ];

      before(() => {
        sinon.stub(SalesModel, 'createSale').resolves(1);
        sinon.stub(SalesModel, 'createSalesProducts').resolves(null);
        sinon.stub(ProductsModel, 'updateQuantity').resolves(true);
        sinon.stub(ProductsModel, 'getById').resolves(modelResponse);
        sinon.stub(ProductsService, 'getById').resolves(serviceResponse);
        sinon.stub(validateProducts, 'validateProduct').resolves(validation);
      });

      after(() => {
        validateProducts.validateProduct.restore();
        ProductsModel.getById.restore();
        SalesModel.createSale.restore();
        SalesModel.createSalesProducts.restore();
        ProductsModel.updateQuantity.restore();
        ProductsService.getById.restore();
      });

      it('Should return with status code "422" and the message "Such amount is not permitted to sell"', async () => {
        const sales = await SalesService.create(input);

        expect(sales.code).to.be.equal(422);
        expect(sales.message).to.be.equal('Such amount is not permitted to sell');
      });
    });
  });

  describe('Update a sale', () => {
    describe('When the sales is updated', () => {
      const modelResponse = { "productId": 1, "quantity": 10, "date": '2022-02-28T00:38:18.000Z' };
      const inventoryUpdate = { newQuantity: 2 };

      const getByIdResponse = { id: 1, name: 'xablau2', quantity: 2 };
      const input = { id: 1, productId: 1, quantity: 10 };

      before(() => {
        sinon.stub(SalesModel, 'getByIdAndProductId').resolves(modelResponse);
        sinon.stub(handleInventory, 'updateInventory').resolves(inventoryUpdate);
        sinon.stub(ProductsModel, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'updateQuantity').resolves(true);
        sinon.stub(SalesModel, 'update').resolves({ productId: 1, quantity: 10 });
      });

      after(() => {
        SalesModel.getByIdAndProductId.restore();
        handleInventory.updateInventory.restore();
        ProductsModel.getById.restore();
        ProductsModel.updateQuantity.restore();
        SalesModel.update.restore();
      });

      it('Should return with status code "200"', async () => {
        const sales = await SalesService.update(input);

        expect(sales.code).to.be.equal(200);
      });

      it('Response should have the following properties: "code", "data"', async () => {
        const sales = await SalesService.update(input);

        expect(sales).to.include.all.keys('code', 'data');
      });

      it('"data" should have the following properties: "saleId", "itemUpdated"', async () => {
        const sales = await SalesService.update(input);

        expect(sales.data).to.include.all.keys('saleId', 'itemUpdated');
      });

      it('"itemUpdated" array should have its inner object deep equal the sale updated', async () => {
        const sales = await SalesService.update(input);

        expect(sales.data.itemUpdated[0]).to.be.deep.equal({ productId: 1, quantity: 10 });
      });
    });

    describe('When the sales is not found', () => {
      const inventoryUpdate = { newQuantity: 2 };

      const getByIdResponse = { id: 1, name: 'xablau2', quantity: 2 };
      const input = { id: 1, productId: 1, quantity: 10 };

      before(() => {
        sinon.stub(SalesModel, 'getByIdAndProductId').resolves(null);
        sinon.stub(handleInventory, 'updateInventory').resolves(inventoryUpdate);
        sinon.stub(ProductsModel, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'updateQuantity').resolves(false);
        sinon.stub(SalesModel, 'update').resolves({ productId: 1, quantity: 10 });
      });

      after(() => {
        SalesModel.getByIdAndProductId.restore();
        handleInventory.updateInventory.restore();
        ProductsModel.getById.restore();
        ProductsModel.updateQuantity.restore();
        SalesModel.update.restore();
      });

      it('Should return with status code "404"', async () => {
        const sales = await SalesService.update(input);

        expect(sales.code).to.be.equal(404);
      });

      it('Response should have the following properties: "code", "message"', async () => {
        const sales = await SalesService.update(input);

        expect(sales).to.include.all.keys('code', 'message');
      });

      it('Should return with status code "404" and the message "Sale not found"', async () => {
        const sales = await SalesService.update(input);

        expect(sales.code).to.be.equal(404);
        expect(sales.message).to.be.equal('Sale not found');
      });
    });

    describe('When the amount to be updated is not allowed', () => {
      const inventoryUpdate = { code: 422, message: 'Such amount is not permitted to sell' };
      const modelResponse = { "productId": 1, "quantity": 10, "date": '2022-02-28T00:38:18.000Z' };

      const getByIdResponse = { id: 1, name: 'xablau2', quantity: 2 };
      const input = { id: 1, productId: 1, quantity: 999 };

      before(() => {
        sinon.stub(SalesModel, 'getByIdAndProductId').resolves(modelResponse);
        sinon.stub(handleInventory, 'updateInventory').resolves(inventoryUpdate);
        sinon.stub(ProductsModel, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'updateQuantity').resolves(false);
        sinon.stub(SalesModel, 'update').resolves({ productId: 1, quantity: 999 });
      });

      after(() => {
        SalesModel.getByIdAndProductId.restore();
        handleInventory.updateInventory.restore();
        ProductsModel.getById.restore();
        ProductsModel.updateQuantity.restore();
        SalesModel.update.restore();
      });

      it('Should return with status code "422"', async () => {
        const sales = await SalesService.update(input);

        expect(sales.code).to.be.equal(422);
      });

      it('Response should have the following properties: "code", "message"', async () => {
        const sales = await SalesService.update(input);

        expect(sales).to.include.all.keys('code', 'message');
      });

      it('Should return with status code "422" and the message "Such amount is not permitted to sell"', async () => {
        const sales = await SalesService.update(input);

        expect(sales.code).to.be.equal(422);
        expect(sales.message).to.be.equal('Such amount is not permitted to sell');
      });
    });
  });

  describe('Delete a sale', () => {
    describe('When the sales is deleted', () => {
      const modelResponse = [
        {
          "productId": 3,
          "quantity": 15,
          "date": "2022-02-28T00:38:18.000Z"
        }
      ];

      const getByIdResponse = {
        code: 200,
        data: modelResponse,
      };

      before(() => {
        sinon.stub(SalesModel, 'deleteSale').resolves(true);
        sinon.stub(SalesModel, 'getById').resolves(modelResponse);
        sinon.stub(SalesService, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'updateQuantity').resolves(true);
      });

      after(() => {
        SalesModel.deleteSale.restore();
        SalesModel.getById.restore();
        SalesService.getById.restore();
        ProductsModel.getById.restore();
        ProductsModel.updateQuantity.restore();
      });

      it('Response should have the following properties: "code"', async () => {
        const sales = await SalesService.deleteSale(2);

        expect(sales).to.include.all.keys('code');
      });

      it('Should return with status code "204"', async () => {
        const sales = await SalesService.deleteSale(2);

        expect(sales.code).to.be.equal(204);
      });
    });

    describe('When the sales to be deleted is not found', () => {
      const modelResponse = [
        {
          "productId": 999,
          "quantity": 15,
          "date": "2022-02-28T00:38:18.000Z"
        }
      ];

      const getByIdResponse = {
        code: 200,
        data: modelResponse,
      };

      before(() => {
        sinon.stub(SalesModel, 'deleteSale').resolves(false);
        sinon.stub(SalesModel, 'getById').resolves(modelResponse);
        sinon.stub(SalesService, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'updateQuantity').resolves(false);
      });

      after(() => {
        SalesModel.deleteSale.restore();
        SalesModel.getById.restore();
        SalesService.getById.restore();
        ProductsModel.getById.restore();
        ProductsModel.updateQuantity.restore();
      });

      it('Response should have the following properties: "code", "message""', async () => {
        const sales = await SalesService.deleteSale(999);

        expect(sales).to.include.all.keys('code', 'message');
      });

      it('Should return with status code "404" and the message "Sale not found"', async () => {
        const sales = await SalesService.deleteSale(999);

        expect(sales.code).to.be.equal(404);
        expect(sales.message).to.be.equal('Sale not found');
      });
    });

    describe('When the sales ID to be deleted is not found', () => {
      const getByIdResponse = {
        code: 404,
        message: 'Sale not found',
      };

      before(() => {
        sinon.stub(SalesModel, 'deleteSale').resolves(false);
        sinon.stub(SalesModel, 'getById').resolves([]);
        sinon.stub(SalesService, 'getById').resolves(getByIdResponse);
        sinon.stub(ProductsModel, 'getById').resolves(undefined);
        sinon.stub(ProductsModel, 'updateQuantity').resolves(false);
      });

      after(() => {
        SalesModel.deleteSale.restore();
        SalesModel.getById.restore();
        SalesService.getById.restore();
        ProductsModel.getById.restore();
        ProductsModel.updateQuantity.restore();
      });

      it('Response should have the following properties: "code", "message""', async () => {
        const sales = await SalesService.deleteSale(999);

        expect(sales).to.include.all.keys('code', 'message');
      });

      it('Should return with status code "404" and the message "Sale not found"', async () => {
        const sales = await SalesService.deleteSale(999);

        expect(sales.code).to.be.equal(404);
        expect(sales.message).to.be.equal('Sale not found');
      });
    });
  });
});