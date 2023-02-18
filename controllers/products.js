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
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.errorHandler = (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: null });
};
