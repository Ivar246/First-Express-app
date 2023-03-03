const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const fPath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(fPath, (err, fdata) => {
    if (err || fdata.length === 0) return cb([]);
    cb(JSON.parse(fdata));
  });
};

module.exports = class Product {
  constructor(productId, title, desc, price, imgUrl) {
    this.productId = productId;
    this.title = title;
    this.description = desc;
    this.price = price;
    this.imgUrl = imgUrl;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.productId) {
        const updatedProducts = products.map((prod) => {
          if (prod.productId === this.productId) return (prod = this);
          return prod;
        });

        // const existingProductIndex = products.findIndex(
        //   (prod) => prod.productId === this.productId
        // );
        // const updatedProducts = [...products];
        // updatedProducts[existingProductIndex] = this;

        fs.writeFile(fPath, JSON.stringify(updatedProducts), (error) => {
          if (error) console.log(error, "while updating to products.json");
        });
      } else {
        this.productId = Math.random().toString();
        products.push(this);
        fs.writeFile(fPath, JSON.stringify(products), (error) => {
          if (error) console.log(error, "while writing to products.json");
        });
      }
    });
  }

  static deleteById(id) {
    console.log(id);
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.productId === id);
      const updatedProducts = products.filter((prod) => prod.productId !== id);
      fs.writeFile(fPath, JSON.stringify(updatedProducts), (error, fdata) => {
        if (!error) {
          console.log(product.price);
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.productId === id);
      cb(product);
    });
  }
};
