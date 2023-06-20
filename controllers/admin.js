const { validationResult } = require("express-validator");
const Product = require("../models/product");
const fileHelper = require("../util/file");

// getProducts
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

    }).catch(err => {
      const error = new Error(err)
      error.HttpStatusCode = 500;
      return next(error)
    });
}

// getAddProduct
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

  const { title, description } = req.body;
  const price = +req.body.price;
  const image = req.file;
  console.log('image', image)
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: {
        title,
        price,
        imageUrl: '',
        description
      },
      errorMessage: 'Attached file is not an image',
      invalidField: ''
    });
  }


  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: {
        title,
        imageUrl: '',
        price,
        description
      },
      errorMessage: errors.array()[0].msg,
      invalidField: errors.array()[0].path
    });
  }

  const imageUrl = image.path;
  console.log("imageUrl: ", typeof imageUrl)
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });

  product.save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // return res.status(500).render("admin/edit-product", {
      //   pageTitle: "Add Product",
      //   path: "/admin/add-product",
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title,
      //     imageUrl,
      //     price,
      //     description
      //   },
      //   errorMessage: "Database operation failed, please try again.",
      //   invalidField: ""
      // })
      // res.redirect('/500')
      // console.log(err)
      console.log('user ', req.user)
      const error = new Error(err)
      error.HttpStatusCode = 500;
      return next(error)
    });
};


// getEditProduct
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
    .catch(err => {
      const error = new Error(err)
      error.HttpStatusCode = 500;
      return next(error)
    })

};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!image) {

  }

  if (!errors.isEmpty()) {
    const { msg: errorMessage, path: invalidField } = errors.array()[0]
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Update Product",
      path: "/admin/edit-product",
      editing: true,
      product: {
        title,
        price,
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
      product.description = description;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }

      return product.save()
        .then(result => {
          res.redirect("/admin/products")
        });
    })
    .catch(err => {
      const error = new Error(err)
      error.HttpStatusCode = 500;
      return next(error)
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
  Product.findById(prodId).then(product => {
    if (!product) {
      return next(new Error("Product not found."))
    }
    fileHelper.deleteFile(product.imageUrl);
    return Product.deleteOne({ _id: prodId, userId: req.user._id })
  })
    .then(() => {
      console.log("Product destroyed");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err)
      error.HttpStatusCode = 500;
      return next(error)
    });
};
