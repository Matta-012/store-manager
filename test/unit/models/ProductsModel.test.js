const sinon = require('sinon');
const { expect } = require('chai');

const connection = require('../../../models/connection');
const { ProductsModel } = require('../../../models');

describe('Products Model tests', () => {
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
      const getAllProducts = await ProductsModel.getAll();

      expect(getAllProducts).to.be.an('array');
      expect(getAllProducts).to.be.not.empty;
    });

    it('Should return an array of objects', async () => {
      const getAll = await ProductsModel.getAll();

      expect(getAll[0]).to.be.an('object');
      expect(getAll[1]).to.be.an('object');
    });

    it('Objects should have the following properties: "id", "name", "quantity"', async () => {
      const getAll = await ProductsModel.getAll();

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
  
      it('Should return an object', async () => {
        const product = await ProductsModel.getById(id);
  
        expect(product).to.be.an('object');
      });
  
      it('Product object should have the following properties: "id", "name", "quantity"', async () => {
        const product = await ProductsModel.getById(id);
  
        expect(product).to.include.all.keys('id', 'name', 'quantity');
      });
  
      it('Product object returned should be deep equal the product searched', async () => {
        const product = await ProductsModel.getById(id);

        expect(product).to.be.deep.equal(getByIdResponse[0][0]);
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

      it('Should return undefined', async () => {
        const product = await ProductsModel.getById(id);

        expect(product).to.be.undefined;
      });
    });
  });

  describe('Create new Product', () => {
    describe('When creating a new product', () => {
      const createResponse = [
        { "id": 4, "name": 'xablau', "quantity": 10 },
      ];

      const name = 'xablau';

      before(() => {
        sinon.stub(connection, 'execute').resolves(createResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return an array with an object if the product exits', async () => {
        const modelResponse = await ProductsModel.getByName(name);

        expect(modelResponse).to.be.false;
      });
    });

    describe('When the new product is created', () => {
      const createResponse = [
        {
          "insertId": 1,
        },
      ];

      const name = 'produto A';
      const quantity = 10;

      before(() => {
        sinon.stub(connection, 'execute').resolves(createResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should create a new product and return the following keys: "id", "name", "quantity"', async () => {
        const modelResponse = await ProductsModel.create({ name, quantity });

        expect(modelResponse).to.include.all.keys('id', 'name', 'quantity');
      });

      it('Created product should be deep equal the data entered', async () => {
        const modelResponse = await ProductsModel.create({ name, quantity });

        expect(modelResponse).to.be.deep.equal({ id: createResponse[0].insertId, name, quantity});
      });
    });
  });

  describe('Update a product', () => {
    describe('When the product is updated', () => {
      const updateResponse = [
        {
          "affectedRows": 1,
        },
      ];

      const result = {
        "id": 4, "name": 'xablau', "quantity": 10,
      };

      before(() => {
        sinon.stub(connection, 'execute').resolves(updateResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return the following object', async () => {
        const modelResponse = await ProductsModel.update(result);

        expect(modelResponse).to.be.deep.equal(result);
      });
    });

    describe('When the product is not updated', () => {
      const updateResponse = [
        {
          "affectedRows": 0,
        },
      ];

      const input = {
        "id": 4, "name": 'xablau', "quantity": 10,
      };

      before(() => {
        sinon.stub(connection, 'execute').resolves(updateResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return null', async () => {
        const modelResponse = await ProductsModel.update(input);

        expect(modelResponse).to.be.null;
      });
    });
  });

  describe('Update a product Quantity', () => {
    describe('When the product quantity is updated', () => {
      const updateResponse = [
        {
          "affectedRows": 1,
        },
      ];

      const input = {
        "productId": 2, "quantity": 10,
      };

      before(() => {
        sinon.stub(connection, 'execute').resolves(updateResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return true', async () => {
        const modelResponse = await ProductsModel.updateQuantity(input);

        expect(modelResponse).to.be.true;
      });
    });

    describe('When the product quantity is not updated', () => {
      const updateResponse = [
        {
          "affectedRows": 0,
        },
      ];

      const input = {
        "productId": 2, "quantity": 10,
      };

      before(() => {
        sinon.stub(connection, 'execute').resolves(updateResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return false', async () => {
        const modelResponse = await ProductsModel.updateQuantity(input);

        expect(modelResponse).to.be.false;
      });
    });
  });

  describe('Delete a product', () => {
    describe('When the product is deleted', () => {
      const deleteResponse = [
        {
          "affectedRows": 1,
        },
      ];

      before(() => {
        sinon.stub(connection, 'execute').resolves(deleteResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return true', async () => {
        const modelResponse = await ProductsModel.deleteProduct(1);

        expect(modelResponse).to.be.true;
      });
    });

    describe('When the product is not deleted', () => {
      const deleteResponse = [
        {
          "affectedRows": 0,
        },
      ];

      before(() => {
        sinon.stub(connection, 'execute').resolves(deleteResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return false', async () => {
        const modelResponse = await ProductsModel.deleteProduct(1);

        expect(modelResponse).to.be.false;
      });
    });
  });
});
