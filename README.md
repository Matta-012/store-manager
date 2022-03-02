# Store Manager

<p>
  <img src='https://img.shields.io/badge/Stmts-100%25-success' />
  <img src='https://img.shields.io/badge/Branch-100%25-success' />
  <img src='https://img.shields.io/badge/Funcs-100%25-success' />
  <img src='https://img.shields.io/badge/Lines-100%25-success' />
</p>

Store Manager is a CRUD for a RESTful API made with Node.js, Express.js, MySQL and Unit Testing with Mocha, Chai and Sinon where you can access the API endpoints to manage a MySQL database with products and sales.

## Technologies and Tools used
* Node.js
* Express.js
* Mysql2
* Dotenv
* Express Async Errors
* Joi
* Camelcase Keys
* Mocha
* Chai
* Sinon
* Nyc
* Nodemon

## Installation
Before cloning the project, make sure you have the following tools installed in your computer:
* Node.js version 14+. Download at official website https://nodejs.org/en/
* MySQL Server. Download at official website https://dev.mysql.com/downloads/mysql/
* MySQL Workbench. Download at official website https://dev.mysql.com/downloads/workbench/
* [Isomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) to make your API requests more easily

#### Cloning the Project
Open your terminal and type the following commands:
```
git clone https://github.com/Matta-012/store-manager.git

cd store-manager

npm install
```
### Creating the Database
* Open the file "StoreManager.sql" and copy all of it's content
* Open MySQL Workbench, log in with your user, create a new query, paste the content from "StoreManager.sql" and execute the query

### Starting the server
In the root directory of the application, create a new file called `.env` to set environment variables (remove the <> after typing your info):
```
MYSQL_HOST=localhost
MYSQL_USER=<your_user>
MYSQL_PASSWORD=<your_password>
DB_NAME=StoreManager
PORT=3001
```
Now you can start the application with the command `npm run dev`.
The following message should be displayed in your terminal:
```
Listening on port 3001
```
**To test the application and check the test coverage, run the following command:**
```
npm run test:mocha
```

## Endpoints
This API has the following endpoints:

| Method | Description |
|---|---|
| `GET - localhost:3001/products` | Returns all products in the database. |
| `GET - localhost:3001/sales` | Returns all sales in the database. |
| `GET - localhost:3001/products/:id` | Search a product by ID and return it. |
| `GET - localhost:3001/sales/:id` | Search a sale by ID and return it. |
| `POST - localhost:3001/products` | Create a new product. |
| `POST - localhost:3001/sales` | Create a new sale. |
| `PUT - localhost:3001/products/:id` | Update the data of the selected product. |
| `PUT - localhost:3001/sales/:id` | Update the data of the selected sale. |
| `DELETE - localhost:3001/products/:id` | Delete the product identified by the ID. |
| `DELETE - localhost:3001/sales/:id` | Delete the product identified by the ID. |

## Usage
All examples will use [Isomnia](https://insomnia.rest/) to make the requests.

### Products (`/products`)
Have all the data about the products in the inventory

#### List all products [GET]
+ Response 200 OK (application/json)

          [
            {
              "id": 1,
              "name": "Martelo de Thor",
              "quantity": 10
            },
            {
              "id": 2,
              "name": "Traje de encolhimento",
              "quantity": 20
            },
            {
              "id": 3,
              "name": "Escudo do Capitão América",
              "quantity": 30
            }
          ]
          
#### Create a new product [POST]
+ Attributes (object)
  + name: product name (must be a string, required, min lenght is 5)
  + quantity: amount of items in the inventory (must be a number, positive, integer and required)

+ Request (application/json)
  + Body

          {
            "name": "Martelo de Thor",
            "quantity": 10
          }
          
+ Response 201 Created (application/json)

          {
            "id": 4,
            "name": "Martelo de Thor",
            "quantity": 10
          }
          
+ Response 422 Unprocessable Entity (application/json)

          {
            "message": "\"quantity\" must be a number"
          }
          
+ Response 409 Conflict (application/json)

          {
            "message": "Product already exists"
          }          
          
#### Get product by ID [GET `/products/{id}`]   
+ Response 200 OK (application/json)

          {
            "id": 4,
            "name": "Martelo de Thor",
            "quantity": 10
          }

+ Response 404 Not Found (application/json)

          {
            "message": "Product not found"
          }
          
#### Update a product [POST `/products/{id}`]
+ Attributes (object)
  + name: product name (must be a string, required, min lenght is 5)
  + quantity: amount of items in the inventory (must be a number, positive, integer and required)

+ Request (application/json)
  + Body

          {
            "name": "Martelo de Thor",
            "quantity": 15
          }
          
+ Response 200 OK (application/json)

          {
            "id": 1,
            "name": "Martelo de Thor",
            "quantity": 15
          }
          
+ Response 422 Unprocessable Entity (application/json)

          {
            "message": "\"quantity\" must be a number"
          }
          
+ Response 404 Not Found (application/json)

          {
            "message": "Product not found"
          }
          
#### Delete a product by ID [DELETE `/products/{id}`]   
+ Response 204 No Content (application/json)

+ Response 404 Not Found (application/json)

          {
            "message": "Product not found"
          }
          
### Sales (`/sales`)
Have all the data about the sales made

#### List all sales [GET]
+ Response 200 OK (application/json)

          [
            {
              "saleId": 1,
              "productId": 2,
              "quantity": 10,
              "date": "2022-03-02T14:53:15.000Z"
            },
            {
              "saleId": 2,
              "productId": 3,
              "quantity": 15,
              "date": "2022-03-02T14:53:15.000Z"
            },
            {
              "saleId": 3,
              "productId": 2,
              "quantity": 2,
              "date": "2022-03-02T20:38:17.000Z"
            }
          ]
          
#### Create a new sale [POST]
+ Attributes (array of objects)
  + productId: ID of the product (must be a number, positive, integer and required)
  + quantity: amount of items in the inventory (must be a number, positive, integer and required)

+ Request (application/json)
  + Body

          [
            {
              "productId": 2,
              "quantity": 2
            }
          ]
          
+ Response 201 Created (application/json)

          {
            "id": 3,
            "itemsSold": [
              {
                "productId": 2,
                "quantity": 2
              }
            ]
          }
          
+ Response 422 Unprocessable Entity (application/json)

          {
            "message": "\"productId\" must be a number"
          }
          
+ Response 400 Bad Request (application/json)

          {
            "message": "\"productId\" is required"
          }          
          
#### Get sale by ID [GET `/sales/{id}`]   
+ Response 200 OK (application/json)

          [
            {
              "productId": 2,
              "quantity": 10,
              "date": "2022-03-02T14:53:15.000Z"
            }
          ]

+ Response 404 Not Found (application/json)

          {
            "message": "Sale not found"
          }
          
#### Update a sale [POST `/sales/{id}`]
+ Attributes (array of objects)
  + productId: ID of the product (must be a number, positive, integer and required)
  + quantity: amount of items in the inventory (must be a number, positive, integer and required)

+ Request (application/json)
  + Body

          [
            {
              "productId": 1,
              "quantity": 10
            }
          ]
          
+ Response 200 OK (application/json)

          {
            "saleId": "1",
            "itemUpdated": [
              {
                "productId": 1,
                "quantity": 10
              }
            ]
          }
          
+ Response 422 Unprocessable Entity (application/json)

          {
            "message": "\"productId\" must be a number"
          }
          
+ Response 404 Not Found (application/json)

          {
            "message": "Sale not found"
          }
          
#### Delete a sale by ID [DELETE `/sales/{id}`]   
+ Response 204 No Content (application/json)

+ Response 404 Not Found (application/json)

          {
            "message": "Sale not found"
          }

## Author

<table>
  <tr>
    <td align="center">
      <a href="https://www.linkedin.com/in/joao-marco-matta/" target="_blank" rel="noopener noreferrer">
        <img src="https://ca.slack-edge.com/TMDDFEPFU-U027HF5MAVB-f953bab6a9e3-512" width="100px;" alt="Foto do Joao Marco Matta"/><br>
        <sub>
          <b>João Marco Matta</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## License
>You can check out the full license [here](https://github.com/Matta-012/store-manager/blob/main/LICENSE)

This project is licensed under the terms of the **MIT** license.
