const fs = require("fs");
const path = require("path");

const fPath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, price) {
    //fetch the previous cart
    fs.readFile(fPath, (error, fdata) => {
      let cart = { products: [], totalPrice: 0 };
      if (!(error || fdata.length === 0)) {
        cart = JSON.parse(fdata);
      }

      // analyze the cart => find eisting product
      const existingProdIndex = cart.products.findIndex(
        (prod) => prod.productId === id
      );
      const existingProd = cart.products[existingProdIndex];
      let updatedProduct;
      // add new product / increase quantity
      if (existingProd) {
        updatedProduct = { ...existingProd };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProdIndex] = updatedProduct;
      } else {
        updatedProduct = {
          productId: id,
          qty: 1,
        };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(fPath, JSON.stringify(cart), (error) => {
        if (error) console.log(error, "while writing file to cart.json");
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(fPath, (error, fdata) => {
      if (error) {
        return;
      }
      const updatedCart = { ...JSON.parse(fdata) };
      const product = updatedCart.products.find(
        (prod) => prod.productId === id
      );
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.productId !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;
      fs.writeFile(fPath, JSON.stringify(updatedCart), (error) => {
        if (error) console.log(error, "while updating file to cart.json");
      });
    });
  }

  static getCart(cb) {
    fs.readFile(fPath, (error, fdata) => {
      if (error || fdata.length === 0) return cb(null);
      const cart = JSON.parse(fdata);
      cb(cart);
    });
  }
};
