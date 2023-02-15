const fs = require("fs");
const path = require("path");

module.exports = class Product {
  constructor(title, desc, price, imgUrl) {
    this.title = title;
    this.description = desc;
    this.price = price;
    this.imgUrl = imgUrl;
  }

  save() {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    fs.readFile(p, (err, fdata) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fdata);
      }
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll() {
    //   return products;
    return [1, 2];
  }
};
