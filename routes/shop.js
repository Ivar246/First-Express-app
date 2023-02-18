const path = require("path");
const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");

router.get("/", productController.getProducts);
router.get("/products");
router.get("/cart");
router.get("/checkout");
module.exports = router;
