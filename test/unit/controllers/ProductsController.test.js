const sinon = require('sinon');
const { expect } = require('chai');

const { ProductsController } = require('../../../controllers');
const { ProductsService } = require('../../../services');

describe('Products Controller tests', () => {
  const request = {};
  const response = {};
  let next = () => {};

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns()
    next = sinon.stub().returns();
  });

  describe('get all Products', () => {
    describe('when all products are found', () => {
      const getAllResponse = {
        code: 200,
        data: [
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
        ],
      };

      before(() => {
        sinon.stub(ProductsService, 'getAll').resolves(getAllResponse);
      });

      after(() => {
        ProductsService.getAll.restore();
      });

      it('Should respond with status code "200"', async () => {
        await ProductsController.getAll(request, response, next);

        expect(response.status.calledWith(getAllResponse.code)).to.be.true;
      });

      it('Response json should return expected data from database', async () => {
        await ProductsController.getAll(request, response, next);

        expect(response.json.calledWith(getAllResponse.data)).to.be.true;
      });
    });

    describe('when all products are not found', () => {
      const getAllResponse = {
        code: 404,
        message: 'Products not found',
      };

      before(() => {
        sinon.stub(ProductsService, 'getAll').resolves(getAllResponse);
      });

      after(() => {
        ProductsService.getAll.restore();
      });

      it('Should respond with status code "404"', async () => {
        await ProductsController.getAll(request, response, next);

        expect(response.status.calledWith(getAllResponse.code)).to.be.true;
      });

      it('Response json should return error message "Products not found"', async () => {
        await ProductsController.getAll(request, response, next);

        expect(response.json.calledWith({ message: getAllResponse.message })).to.be.true;
      });
    });
  });

  describe('get Product by ID', () => {
    describe('When response returns the Product', () => {
      const id = 1;
      const getByIdResponse = {
        code: 200,
        data: [
          {
            "id": 1,
            "name": "produto A",
            "quantity": 10
          },
        ],
      };

      before(() => {
        request.params = { id };
        sinon.stub(ProductsService, 'getById').resolves(getByIdResponse);
      });

      after(() => {
        ProductsService.getById.restore();
      });

      it('Should respond with status code "200"', async () => {
        await ProductsController.getById(request, response, next);

        expect(response.status.calledWith(getByIdResponse.code)).to.be.true;
      });

      it('Response json should return expected data from database', async () => {
        await ProductsController.getById(request, response, next);

        expect(response.json.calledWith(getByIdResponse.data)).to.be.true;
      });
    });

    describe('When the product is not found', () => {
      const id = 6;
      const getByIdResponse = {
        code: 404,
        message: 'Product not found',
      };

      before(() => {
        request.params = { id };
        sinon.stub(ProductsService, 'getById').resolves(getByIdResponse);
      });

      after(() => {
        ProductsService.getById.restore();
      });

      it('Should respond with status code "404"', async () => {
        await ProductsController.getById(request, response, next);

        expect(response.status.calledWith(getByIdResponse.code)).to.be.true;
      });

      it('Response json should return error message "Product not found"', async () => {
        await ProductsController.getById(request, response, next);

        expect(response.json.calledWith({ message: getByIdResponse.message })).to.be.true;
      });
    });
  });

  describe('Create new Product', () => {
    describe('When the new product is created', () => {
      const controllerResponse = {
        code: 201,
        data: {
          "id": 1,
          "name": "produto A",
          "quantity": 10
        },
      };

      before(() => {
        request.body = { "name": "produto A", "quantity": 10 };
        sinon.stub(ProductsService, 'create').resolves(controllerResponse);
      });

      after(() => {
        ProductsService.create.restore();
      });

      it('Should respond with status code "201"', async () => {
        await ProductsController.create(request, response, next);

        expect(response.status.calledWith(controllerResponse.code)).to.be.true;
      });

      it('Response json should return expected data from database', async () => {
        await ProductsController.create(request, response, next);

        expect(response.json.calledWith(controllerResponse.data)).to.be.true;
      });
    });

    describe('When the new product already exists', () => {
      const controllerResponse = {
        code: 409,
        message: 'Product already exists'
      };

      before(() => {
        request.body = { "name": "produto A", "quantity": 10 };
        sinon.stub(ProductsService, 'create').resolves(controllerResponse);
      });

      after(() => {
        ProductsService.create.restore();
      });

      it('Should respond with status code "409"', async () => {
        await ProductsController.create(request, response, next);

        expect(response.status.calledWith(controllerResponse.code)).to.be.true;
      });

      it('Response json should return error message "Product already exists"', async () => {
        await ProductsController.create(request, response, next);

        expect(response.json.calledWith({ message: controllerResponse.message })).to.be.true;
      });
    });
  });
});