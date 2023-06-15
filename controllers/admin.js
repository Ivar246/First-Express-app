const { validationResult } = require("express-validator");

const Product = require("../models/product");


exports.getProducts = (req, res, next) => {
  Product.find()
    // .select("title price -_id")
    // .populate("userId", "name email -_id")
    .then(products => {
      console.log(products)
      res.render("admin/products", {
        pageTitle: "Admin Products",
        prods: products,
        path: "/admin/products",
      })

    }).catch(err => console.log(err))
}

exports.getAddProduct = (req, res, next) => {

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    product: {
      title: '',
      imageUrl: '',
      price: '',
      description: ''
    },
    errorMessage: '',
    invalidField: ''
  });
};

exports.postAddProduct = (req, res, next) => {

  const { title, imageUrl, description
  } = req.body;
  const price = +req.body.price;
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: {
        title,
        imageUrl,
        price,
        description
      },
      errorMessage: errors.array()[0].msg,
      invalidField: errors.array()[0].path
    });
  }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });

  product.save()
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) return res.redirect("/");
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      if (!product) return res.redirect("/");
      return res.render("admin/edit-product", {
        pageTitle: "Update Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        errorMessage: '',
        invalidField: ''
      })

    })
    .catch(err => console.log(err))

};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { msg: errorMessage, path: invalidField } = errors.array()[0]
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Update Product",
      path: "/admin/edit-product",
      editing: true,
      product: {
        title,
        price,
        imageUrl,
        description,
        _id: productId

      },
      errorMessage,
      invalidField
    })
  }

  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      product.Url = imageUrl;
      product.description = description;

      return product.save()
        .then(result => {
          res.redirect("/admin/products")
        });
    })
    .catch(error => {
      console.log(error)
    })
};

// exports.getProducts = (req, res, next) => {
//   req.user
//     .getProducts()
//     .then((products) => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Product",
//         path: "/admin/products",
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then((result) => {
      console.log("Product destroyed");
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};
