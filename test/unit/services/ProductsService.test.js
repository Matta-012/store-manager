const sinon = require('sinon');
const { expect } = require('chai');

const connection = require('../../../models/connection');
const { ProductsService } = require('../../../services');

describe('Products Service tests', () => {
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
      sinon.stub(connection, 'execute').resolves(getAllResponse);
    });

    after(() => {
      connection.execute.restore();
    });

    it('Should return an array not empty', async () => {
      const getAll = await ProductsService.getAll();

      expect(getAll).to.be.an('array');
      expect(getAll).to.be.not.empty;
    });

    it('Should return an array of objects', async () => {
      const getAll = await ProductsService.getAll();

      expect(getAll[0]).to.be.an('object');
      expect(getAll[1]).to.be.an('object');
    });

    it('Objects should have the following properties: "id", "name", "quantity"', async () => {
      const getAll = await ProductsService.getAll();

      expect(getAll[0]).to.include.all.keys('id', 'name', 'quantity');
      expect(getAll[1]).to.include.all.keys('id', 'name', 'quantity');
    });
  });

  describe('get Product by ID', () => {
    describe('When the product is found', () => {
      const id = 1;
      const getByIdResponse = [
        [
          {
            "id": 1,
            "name": "produto A",
            "quantity": 10
          },
        ]
      ];

      before(() => {
        sinon.stub(connection, 'execute').resolves(getByIdResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return an array with one product', async () => {
        const product = await ProductsService.getById(id);
  
        expect(product).to.be.an('array');
        expect(product).to.be.not.empty;
        expect(product).to.be.have.length(1);
      });
  
      it('Should return an array with an object', async () => {
        const product = await ProductsService.getById(id);
  
        expect(product[0]).to.be.an('object');
      });
  
      it('Product object should have the following properties: "id", "name", "quantity"', async () => {
        const product = await ProductsService.getById(id);
  
        expect(product[0]).to.include.all.keys('id', 'name', 'quantity');
      });
  
      it('Product object returned should be deep equal the product searched', async () => {
        const product = await ProductsService.getById(id);

        expect(product).to.be.deep.equal(getByIdResponse[0]);
      });
    });

    describe('When the product is not found', () => {
      const id = 5;
      const getByIdResponse = [[]];
  
      before(() => {
        sinon.stub(connection, 'execute').resolves(getByIdResponse);
      });
  
      after(() => {
        connection.execute.restore();
      });

      it('Should return "null"', async () => {
        const product = await ProductsService.getById(id);

        expect(product).to.be.equal(null);
      });
    });
  });
});