const frisby = require("frisby");
require("dotenv").config();

describe("03-validations", () => {
  const url = `http://localhost:${process.env.PORT}`;

  describe("3 - Realiza validações nos produtos e nas vendas", () => {
		it("quando cadastrar um produto será validado que o campo name está presente no body", async () => {
			await frisby
				.post(`${url}/products/`, {
					quantity: 2,
				})
				.expect("status", 400)
				.then((response) => {
					const { json } = response;
					expect(Object.keys(json)).toContain("message");
					expect(json.message).toEqual('"name" is required');
				});
		});

		it("quando cadastrar um produto será validado que o campo name possui 5 ou mais caracteres", async () => {
			await frisby
				.post(`${url}/products/`, {
					name: "Arco",
					quantity: 100,
				})
				.expect("status", 422)
				.then((response) => {
					const { json } = response;

					expect(Object.keys(json)).toContain("message");
					expect(json.message).toEqual('"name" length must be at least 5 characters long');
				}); 
		});

		it("quando cadastrar um produto será validado que o campo quantity está presente no body", async () => {
			await frisby
				.post(`${url}/products/`, {
					name: "Olho de Thundera",
				})
				.expect("status", 400)
				.then((response) => {
					const { json } = response;

					expect(Object.keys(json)).toContain("message");
					expect(json.message).toEqual('"quantity" is required');
				});
		});

		it("quando cadastrar um produto será validado que o campo quantity é um número inteiro maior que zero", async  () => {
			await frisby
				.post(`${url}/products`, {
					name: "Produto do Batista",
					quantity: -1,
				})
				.expect("status", 422)
				.then((response) => {
					const { json } = response;

					expect(Object.keys(json)).toContain("message");
					expect(json.message).toEqual('"quantity" must be greater than or equal to 1');
				});
			});
		});

		// atualizações dos produtos
		it("quando atualizar um produto será validado que o campo name possui 5 ou mais caracteres", async  () => {
			await frisby
				.put(`${url}/products/1`, {
					name: "Mar",
					quantity: 10,
				})
				.expect("status", 422)
				.then((response) => {
					const { json } = response;

					expect(Object.keys(json)).toContain("message");
					expect(json.message).toEqual('"name" length must be at least 5 characters long');
				}); 
		});

		it("quando atualizar um produto será validado que o campo quantity está presente no body", async () => {
			await frisby
				.put(`${url}/products/1`, {
					name: "Olho de Thundera",
				})
				.expect("status", 400)
				.then((response) => {
					const { json } = response;

					expect(Object.keys(json)).toContain("message");
					expect(json.message).toEqual('"quantity" is required');
				});
		});

		it("quando atualizar um produto será validado que o quantity é um número inteiro maior que zero", async () => {
			await frisby
				.put(`${url}/products/1`, {
					name: "Martelo de Thor",
					quantity: 0,
				})
				.expect("status", 422)
				.then((response) => {
					const { json } = response;

					expect(Object.keys(json)).toContain("message");
					expect(json.message).toEqual('"quantity" must be greater than or equal to 1');
				});
		});

		// registro das vendas
		it("quando cadastrar uma venda será validado que o campo productId está presente no body", async () => {
			await frisby
				.post(`${url}/sales/`, [
					{
						quantity: 2,
					}
				])
				.expect("status", 400)
				.then((response) => {
					const { json } = response;

					expect(Object.keys(json)).toContain("message");
					expect(json.message).toEqual('"productId" is required');
				});
		});

		it("quando cadastrar uma venda será validado que o campo quantity está presente no body", async () => {
			await frisby
				.post(`${url}/sales/`, [
					{
						productId: 1,
					},
				])
				.expect("status", 400)
				.then((response) => {
					const { json } = response;

					expect(Object.keys(json)).toContain("message");
					expect(json.message).toBe('"quantity" is required');
				});
		});

		it("quando cadastrar uma venda será validado que o campo quantity é um número inteiro maior que zero", async () => {
			await frisby
				.post(`${url}/sales/`, [
					{
						productId: 1,
						quantity: -1,
					},
				])
				.expect("status", 422)
				.then((response) => {
					const { json } = response;

					expect(Object.keys(json)).toContain("message");
					expect(json.message).toBe('"quantity" must be greater than or equal to 1');
				});
		});

	// atualizações das vendas
	it("quando atualizar uma venda Será validado que o campo productId está presente no body", async () => {
		await frisby
			.put(`${url}/sales/1`, [
				{
					quantity: 10
				},
			])
			.expect("status", 400)
			.then((response) => {
				const { json } = response;

				expect(Object.keys(json)).toContain("message");
				expect(json.message).toBe('"productId" is required');
		});
	});

	it("quando atualizar uma venda Será validado que o campo quantity está presente no body", async () => {
		await frisby
			.put(`${url}/sales/1`, [
				{
					productId: 1,
				},
			])
			.expect("status", 400)
			.then((response) => {
				const { json } = response;

				expect(Object.keys(json)).toContain("message");
				expect(json.message).toBe('"quantity" is required');
			});
	});

	it("quando atualizar uma venda Será validado que o campo quantity é um número inteiro maior do que zero", async () => {
		await frisby
			.put(`${url}/sales/1`, [
				{
					productId: 1,
					quantity: -1,
				},
			])
			.expect("status", 422)
			.then((response) => {
				const { json } = response;

				expect(Object.keys(json)).toContain("message");
				expect(json.message).toBe('"quantity" must be greater than or equal to 1');
			});
	});
});
