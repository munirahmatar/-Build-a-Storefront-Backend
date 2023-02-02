

API and Database Requirements
   -API Endpoints
      .Users
      .Products
      .Orders
      .Order Products



- users endpoints:
   1- create :

       localhost:3000/api/users
          http: post 
          body json :
            {
    "email": "newuser@1.com",
    "username": "newuser",
    "firstname": "newuser",
    "lastname": "newuser",
    "password": "newuser123"
  }

2- Index:

    localhost:3000/api/users/
    http: get 


3- Show:

    localhost:3000/api/users/1
    http: get 


4- Delete:

   localhost:3000/api/users/1
    http: delete


5- Edit:

   localhost:3000/api/users/1
   http: patch

    body json :
            {
    "email": "tryedit@1.com",
    "username": "tryedit",
    "firstname": "tryedit",
    "lastname": "tryedit",
    "password": "newuser123"
  }

6- Authenticate user:

   localhost:3000/api/users/authenticate

    body json :
            {
    
    "username": "tryedit",
    "password": "newuser123"
  }

- Products endpoint:
    
     1- create :

       localhost:3000/api/products
       http: post 
         {
    "name": "new product",
    "description": "product description",
    "price": 99,
    "category": "Electronics"
  }

  2- Index:

    localhost:3000/api/products/
    http: get 

  3- Show:

    localhost:3000/api/products/1
    http: get 

  4- Delete:

   localhost:3000/api/products/1
    http: delete

   5- Edit:

   localhost:3000/api/products/1
   http: put
     {
    "id": 1,
    "name": "new product",
    "description": "product description",
    "price": 50,
    "category": "Electronics."
  }


- orders endpoint:

 1- create :

       localhost:3000/api/orders
       http: post 
         {
    "user_id": 1,
    "status": "active"
  }

  2- Index:

    localhost:3000/api/orders/
    http: get 

    3- Show:

    localhost:3000/api/orders/1
    http: get 

    4- Delete:

   localhost:3000/api/orders/1
    http: delete

 
   5- Edit:
 
   localhost:3000/api/orders/1
   http: put

     {
    "id": 1,
    "user_id": 1,
    "status": "active."
  }

  - order-Products endpoint:

    localhost:3000/api/order-products/

    
    
2- Data Schema:
    
-Users Schema:
   
      
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE,
  username VARCHAR(50) NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);



-Orders Schema:



CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  status VARCHAR(100),
  user_id BIGINT REFERENCES users(id) NOT Null
);



-Products Schema:



CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  price NUMERIC(17, 2) NOT NULL, 
  category VARCHAR(50) NOT NULL
);



-Products for Order Schema:


CREATE TABLE order_products(
  id SERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) NOT NULL,
  product_id BIGINT REFERENCES products(id) NOT NULL,
  quantity INT
);


3- Type the data:

    - users table:

    type User = {
    id?: number;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    password?: string;
  };
  


    -  order type:


          type Order = {
            id?: number;
            status: string;
            user_id: number;
            username?: string;
            products?: OrderProduct[];
            };

    - product table:
         type Product = {
           id?: number;
           name: string;
           description: string;
           price: number;
           category: string;
         };
    

    - order product type:
       
       type OrderProduct = {
          id?: number;
          quantity: number;
          order_id: number;
          product_id: number;
          products?: Product[];
        };