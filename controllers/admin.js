const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
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
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Product",
      path: "/admin/products",
    });
  });
};
