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
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

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
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      })

    })
    .catch(err => console.log(err))

};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  console.log("prodId: ", prodId)
  const newObj = {
    title: updatedTitle,
    price: updatedPrice,
    imageUrl: updatedImageUrl,
    description: updatedDesc
  }
  Product.findByIdAndUpdate(prodId, newObj).then(() => {
    return res.redirect("/admin/products");
  }).catch(error => {
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
  Product.findByIdAndRemove(prodId)
    .then((result) => {
      console.log("Product destroyed");
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};
