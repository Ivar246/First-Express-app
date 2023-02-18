const fs = require("fs");
const path = require("path");

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
  constructor(title, desc, price, imgUrl) {
    this.title = title;
    this.description = desc;
    this.price = price;
    this.imgUrl = imgUrl;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(fPath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
