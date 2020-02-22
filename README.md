# System Requirements
- node.js
- npm

# Installation
1. Go to app directory by `cd elevenia-adapter`.
2. Make sure you already install [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) on your machine.
3. Install dependencies by `npm install`.
4. To run application type `node ./idxmain.js` in your terminal.

# API Request
1. End point for using API is "http://localhost:1999/api/elevenia" with request method POST make sure add header "Content-Type: application/json"
2. Initiate request to get product data from elevenia API put this on body:
   ```
   { "code": 0 }
   ```
3. To get product from postgres database put this on body:
    ```
    {"code": 1}
    ```
4. To edit product put this on body:
    ```
    {
      "code": 2,
      "prdName": "Product Name",
      "prdPrc": 10000,
      "prdImage": "http://image.url/01.jpg",
      "prdDetail": "Details of product",
      "prdNo": 220
    }
    ```
5. To delete product put this on body
    ```
    {
      "code": 3,
      "prdNo": 220
    }
    ```

# API Parameters
- code = Processing Code (string/integer)
- prdName = Name of Product (string)
- prdImage = Url for Image of product (url string)
- prdPrc = Price of product (integer)
- prdDetail = Details of product (string)
- prdNo = Number of Product (integer)
