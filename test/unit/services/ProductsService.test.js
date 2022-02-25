const sinon = require('sinon');
const { expect } = require('chai');

const { ProductsModel } = require('../../../models');
const { ProductsService } = require('../../../services');

describe('Products Service tests', () => {
  describe('get all Products', () => {
    describe('when response returns all products', () => {
      const getAllResponse = [
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
      ];
  
      before(() => {
        sinon.stub(ProductsModel, 'getAll').resolves(getAllResponse);
      });
  
      after(() => {
        ProductsModel.getAll.restore();
      });
  
      it('Should return an array not empty', async () => {
        const getAll = await ProductsService.getAll();
  
        expect(getAll.data).to.be.an('array');
        expect(getAll.data).to.be.not.empty;
      });
  
      it('Should return an array of objects', async () => {
        const getAll = await ProductsService.getAll();
  
        expect(getAll.data[0]).to.be.an('object');
        expect(getAll.data[1]).to.be.an('object');
      });
  
      it('Should return status code "200"', async () => {
        const getAll = await ProductsService.getAll();
  
        expect(getAll.code).to.be.equal(200);
      });
  
      it('Objects should have the following properties: "id", "name", "quantity"', async () => {
        const getAll = await ProductsService.getAll();
  
        expect(getAll.data[0]).to.include.all.keys('id', 'name', 'quantity');
        expect(getAll.data[1]).to.include.all.keys('id', 'name', 'quantity');
      });
    });

    describe('when products are not found', () => {
      const getAllResponse = [];
  
      before(() => {
        sinon.stub(ProductsModel, 'getAll').resolves(getAllResponse);
      });
  
      after(() => {
        ProductsModel.getAll.restore();
      });

      it('Should return status code "404"', async () => {
        const getAll = await ProductsService.getAll();

        expect(getAll.code).to.be.equal(404);
      });

      it('Should return error message "Products not found"', async () => {
        const getAll = await ProductsService.getAll();

        expect(getAll.message).to.be.equal('Products not found');
      });
    });
  });

  describe('get Product by ID', () => {
    describe('When the product is found', () => {
      const id = 1;
      const getByIdResponse = [
        {
          "id": 1,
          "name": "produto A",
          "quantity": 10
        },
      ];

      before(() => {
        sinon.stub(ProductsModel, 'getById').resolves(getByIdResponse);
      });

      after(() => {
        ProductsModel.getById.restore();
      });

      it('Should return with status code "200"', async () => {
        const product = await ProductsService.getById(id);

        expect(product.code).to.be.equal(200);
      });

      it('Should return an array with one product', async () => {
        const product = await ProductsService.getById(id);

        expect(product.data).to.be.an('array');
        expect(product.data).to.be.not.empty;
        expect(product.data).to.be.have.length(1);
      });

      it('Should return an array with an object', async () => {
        const product = await ProductsService.getById(id);

        expect(product.data[0]).to.be.an('object');
      });

      it('Product object should have the following properties: "id", "name", "quantity"', async () => {
        const product = await ProductsService.getById(id);
  
        expect(product.data[0]).to.include.all.keys('id', 'name', 'quantity');
      });
  
      it('Product object returned should be deep equal the product searched', async () => {
        const product = await ProductsService.getById(id);

        expect(product.data[0]).to.be.deep.equal(getByIdResponse[0]);
      });
    });

    describe('When the product is not found', () => {
      const id = 5;
      const getByIdResponse = undefined;
  
      before(() => {
        sinon.stub(ProductsModel, 'getById').resolves(getByIdResponse);
      });
  
      after(() => {
        ProductsModel.getById.restore();
      });

      it('Should not return data', async () => {
        const product = await ProductsService.getById(id);

        expect(product.data).to.be.undefined;
      });

      it('Should return with status code "404"', async () => {
        const product = await ProductsService.getById(id);

        expect(product.code).to.be.equal(404);
      });

      it('Should return with error message "Product not found"', async () => {
        const product = await ProductsService.getById(id);

        expect(product.message).to.be.equal('Product not found');
      });
    });
  });
});