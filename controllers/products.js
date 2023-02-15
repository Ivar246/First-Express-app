const fs = require("fs");
const Product = require("../models/product");
// const readData = fs.readFile("../products.json");
// console.log(readData);
// const parsedData = JSON.parse(readData);

// function storeInJson(req) {
//   const data = JSON.stringify(req.body);
//   fs.writeFile("products.json", data, (err) => {
//     if (err) throw err;
//     console.log("Data has been submitted.");
//   });
// }

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
    productCSS: true,
    activeProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.imageUrl
  );
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};

exports.errorHandler = (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: null });
};
