

Project 2: Build a Storefront Backend



2- create two database
      - DB_DATABASE=store_dev
      - DB_DATABASE_TEST=store_test //for testing ..



 3- scripts:
           

    "watch": "tsc-watch --esModuleInterop src/index.ts --outDir ./build --onSuccess \"node ./build/index.js\"",  
         // to run the application in watch mode
    "migration": "db-migrate up",
    "migration down": "db-migrate down",
    "tesst": "export NODE_ENV=test  && db-migrate up --config ./database.json -e test && tsc && npm run jasmine && db-migrate down",
     "start": "nodemon src/index.ts",     // to run the application in node.
     "build": "npx tsc",


4- localhost on  http://localhost:3000/
   routes on  http://localhost:3000/api