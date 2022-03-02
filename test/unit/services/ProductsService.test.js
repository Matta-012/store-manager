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

  describe('Create new Product', () => {
    describe('When the new product is created', () => {
      const createResponse = {
        "id": 1,
        "name": "produto A",
        "quantity": 10
      };

      const name = 'produto A';
      const quantity = 10;

      before(() => {
        sinon.stub(ProductsModel, 'create').resolves(createResponse);
        sinon.stub(ProductsModel, 'getByName').resolves(true);
      });

      after(() => {
        ProductsModel.create.restore();
        ProductsModel.getByName.restore();
      });

      it('Should return status code "201"', async () => {
        const serviceResponse = await ProductsService.create({ name, quantity });

        expect(serviceResponse.code).to.be.equal(201);
      });

      it('Should return an object with the following keys: "code", "data"', async () => {
        const serviceResponse = await ProductsService.create({ name, quantity });

        expect(serviceResponse).to.include.all.keys('code', 'data');
      });

      it('Should return an object deep equal the product created', async () => {
        const serviceResponse = await ProductsService.create({ name, quantity });

        expect(serviceResponse.data).to.be.deep.equal(createResponse);
      });
    });

    describe('When the product already exists', () => {
      const name = 'produto A';
      const quantity = 10;

      before(() => {
        sinon.stub(ProductsModel, 'getByName').resolves(false);
      });

      after(() => {
        ProductsModel.getByName.restore();
      });

      it('Should return with status code "409"', async () => {
        const serviceResponse = await ProductsService.create({ name, quantity });

        expect(serviceResponse.code).to.be.equal(409);
      });

      it('Should return with error message "Product already exists"', async () => {
        const serviceResponse = await ProductsService.create({ name, quantity });

        expect(serviceResponse.message).to.be.equal('Product already exists');
      });
    });
  });

  describe('Update a Product', () => {
    const updateResponse = {
      "id": 1,
      "name": "produto A",
      "quantity": 10
    };

    describe('When the product is updated', () => {

      before(() => {
        sinon.stub(ProductsModel, 'update').resolves(updateResponse);
      });

      after(() => {
        ProductsModel.update.restore();
      });

      it('Should return status code "200"', async () => {
        const serviceResponse = await ProductsService.update(updateResponse);

        expect(serviceResponse.code).to.be.equal(200);
      });

      it('Should return an object with the following keys: "code", "data"', async () => {
        const serviceResponse = await ProductsService.update(updateResponse);

        expect(serviceResponse).to.include.all.keys('code', 'data');
      });

      it('Should return an object deep equal the product updated', async () => {
        const serviceResponse = await ProductsService.update(updateResponse);

        expect(serviceResponse.data).to.be.deep.equal(updateResponse);
      });
    });

    describe('When the product is not found', () => {
      before(() => {
        sinon.stub(ProductsModel, 'update').resolves(null);
      });

      after(() => {
        ProductsModel.update.restore();
      });

      it('Should return with status code "404"', async () => {
        const serviceResponse = await ProductsService.update(updateResponse);

        expect(serviceResponse.code).to.be.equal(404);
      });

      it('Should return with error message "Product not found"', async () => {
        const serviceResponse = await ProductsService.update(updateResponse);

        expect(serviceResponse.message).to.be.equal('Product not found');
      });
    });
  });

  describe('Delete a Product', () => {
    describe('When the product is deleted', () => {
      before(() => {
        sinon.stub(ProductsModel, 'deleteProduct').resolves(true);
      });

      after(() => {
        ProductsModel.deleteProduct.restore();
      });

      it('Should return status code "204"', async () => {
        const serviceResponse = await ProductsService.deleteProduct(1);

        expect(serviceResponse.code).to.be.equal(204);
      });
    });

    describe('When the product is not deleted', () => {
      before(() => {
        sinon.stub(ProductsModel, 'deleteProduct').resolves(false);
      });

      after(() => {
        ProductsModel.deleteProduct.restore();
      });

      it('Should return with status code "404"', async () => {
        const serviceResponse = await ProductsService.deleteProduct(1);

        expect(serviceResponse.code).to.be.equal(404);
      });

      it('Should return with error message "Product not found"', async () => {
        const serviceResponse = await ProductsService.deleteProduct(1);

        expect(serviceResponse.message).to.be.equal('Product not found');
      });
    });
  });
});