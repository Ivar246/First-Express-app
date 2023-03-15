const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = +req.params.productId;
  Product.findOne({ where: { id: prodId } })
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: "Product Details",
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      console.log(".............................................");
      return cart
        .getProducts()
        .then((products) => {
          console.log("products; ", products);
          res.render("shop/cart", {
            products: products,
            path: "/cart",
            pageTitle: "Your Cart",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (let product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.productId === product.productId
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       products: cartProducts,
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log("prodId:  ", prodId);
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) product = products[0];
      let newQuantitiy = 1;
      if (product) {
        //..
      }
      console.log("products:::::", product);
      return Product.findByPk(prodId)
        .then((product) => {
          console.log(product);
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantitiy },
          });
        })
        .then(() => {
          res.redirect("/cart");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
