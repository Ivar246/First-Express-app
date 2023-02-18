const path = require("path");
const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");

// admin/add-product=> GET
router.get("/add-product", productController.getAddProduct);
router.get("/admin-product");

// admin/add-product=>POST
router.post("/add-product", productController.postAddProduct);
exports.routes = router;
