const fs = require("fs")
const path = require("path")
const PDFDocument = require("pdfkit")

const Product = require("../models/product");
const Order = require("../models/orders");

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  Product.find()
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
  const prodId = req.params.productId;
  Product.findById(prodId)
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
  const page = +req.query.page || 1;
  console.log(typeof page)
  let totalItems;

  Product.find().count().then(numProducts => {
    totalItems = numProducts;
    return Product.find().skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  })

    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        successMessage: req.flash("success"),
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        totalItems: totalItems



      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    }).then(result => {
      res.redirect("/cart")
    })
}

exports.getCart = (req, res, next) => {
  req.user.populate("cart.items.productId")
    .then(user => {
      res.render("shop/cart", {
        products: user.cart.items || [],
        path: "/cart",
        pageTitle: "Your Cart",
      });
    })
    .catch(err => console.log(err))

  // Product.fetchAll()
  //   .then(products => {
  //     console.log("products:", products)
  //     return cartItems.map(cartItem => {
  //       const matchedProduct = products.find(product => product._id.toString() === cartItem.productId.toString())
  //       if (matchedProduct) return { ...matchedProduct, quantity: cartItem.quantity }
  //     });
  //   })
  //   .then(mappedProducts => {
  //     console.log("mappedProducts:", mappedProducts)
  //     res.render("shop/cart", {
  //       products: mappedProducts,
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //     });
  //   })

}

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.removeFromCart(prodId)
    .then(result => {
      console.log(result)
      return res.redirect("/cart");
    }).catch(err => { console.log(err) })
}

exports.getCheckout = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then(user => {
      const products = user.cart.items;
      let total = 0;
      products.forEach(prod => {
        total += prod.quantity * prod.productId.price;
      })
      res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
        products: products,
        totalSum: total
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })


}


exports.postOrder = (req, res, next) => {
  req.user.populate("cart.items.productId")
    .then(user => {
      const products = user.cart.items.map(i => {
        console.log(i)
        return { quantity: i.quantity, productData: { ...i.productId._doc } }

      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      })
      return order.save()
    })
    .then(result => {
      return req.user.clearCart();
    }).then(() => {
      res.redirect("/orders");
    }).catch(error => console.log(error))


}


exports.getOrders = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render("shop/orders", {
        orders,
        pageTitle: "Orders",
        path: "/orders",
      });
    });
}


// getInvoice
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).then(order => {
    if (!order) {
      return next(new Error("No order found."))
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized"))
    }

    const invoiceName = 'invoice-' + orderId + '.pdf'
    const invoicePath = path.join('data', 'invoices', invoiceName);

    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath))
    res.setHeader("Content-Type", 'application/pdf');
    res.setHeader("Content-Disposition", "inline; filename=" + invoiceName)
    pdfDoc.pipe(res)
    pdfDoc.fontSize(26).text("Invoice", {
      underline: true
    });
    pdfDoc.text('..................');
    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.productData.price;
      pdfDoc.fontSize(14).text(prod.productData.title + '-' + prod.quantity + ' x' + '$' + prod.productData.price)
    })
    pdfDoc.fontSize(20).text("Total Price: " + totalPrice)
    pdfDoc.end();
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader("Content-Type", 'application/pdf');
    //   res.setHeader("Content-Disposition", "inline; filename=" + invoiceName)
    //   res.send(data)
    // })
    // const file = fs.createReadStream(invoicePath);

    // file.pipe(res)

  }).catch(err => next(err))
}



// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart
//         .getProducts()
//         .then((products) => {
//           console.log("products; ", products);
//           res.render("shop/cart", {
//             products: products,
//             path: "/cart",
//             pageTitle: "Your Cart",
//           });
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   // Cart.getCart((cart) => {
//   //   Product.fetchAll((products) => {
//   //     const cartProducts = [];
//   //     for (let product of products) {
//   //       const cartProductData = cart.products.find(
//   //         (prod) => prod.productId === product.productId
//   //       );
//   //       if (cartProductData) {
//   //         cartProducts.push({ productData: product, qty: cartProductData.qty });
//   //       }
//   //     }
//   //     res.render("shop/cart", {
//   //       products: cartProducts,
//   //       path: "/cart",
//   //       pageTitle: "Your Cart",
//   //     });
//   //   });
//   // });
// };

// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then((cart) => {
//       console.log("...................................................\n\n\n\n\n\n}");
//       console.log(cart)
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then((products) => {
//       let product;
//       if (products.length > 0) product = products[0];
//       let newQuantity = 1;
//       if (product) {
//         const oldQuantity = product.cartItem.quantity;
//         newQuantity += oldQuantity;
//         return fetchedCart
//           .addProduct(product, {
//             through: { quantity: newQuantity },
//           })
//           .then((result) => {
//             res.redirect("/cart");
//           });
//       }
//       return Product.findByPk(prodId)
//         .then((product) => {
//           return fetchedCart.addProduct(product, {
//             through: { quantity: newQuantity },
//           });
//         })
//         .then(() => {
//           res.redirect("/cart");
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// exports.postDeleteCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then((products) => {
//       const product = products[0];
//       return product.cartItem.destroy();
//     })
//     .then((result) => {
//       res.redirect("/cart");
//     })
//     .catch((error) => console.log(error));
// };

// exports.postOrder = (req, res, next) => {
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts();
//     })
//     .then((products) => {
//       console.log("Products:", products);
//       return req.user
//         .createOrder()
//         .then((order) => {
//           return order.addProducts(
//             products.map((product) => {
//               product.orderItem = { quantity: product.cartItem.quanitiy };
//               return product;
//             })
//           );
//         })
//         .catch((err) => console.log(err));
//     })
//     .then((result) => {
//       res.redirect("/orders");
//     })
//     .catch((err) => console.log(err));
// };

// exports.getOrders = (req, res, next) => {
//   res.render("shop/orders", {
//     path: "/orders",
//     pageTitle: "Your Orders",
//   });
// };

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
