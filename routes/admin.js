const path = require("path");
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const { isAuth } = require("../middleware/is_auth");

// admin/add-product=> GET
router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post("/edit-product", isAuth, adminController.postEditProduct);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);
router.post("/add-product", isAuth, adminController.postAddProduct);


exports.routes = router;
