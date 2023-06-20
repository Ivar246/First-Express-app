const path = require("path");
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const { isAuth } = require("../middleware/is_auth");
const { body } = require("express-validator");



//  /products => GET
router.get("/products", isAuth, adminController.getProducts);

// admin/add-product=> GET
router.get("/add-product", isAuth, adminController.getAddProduct);

//  admin/add-product => POST
router.post("/add-product", [
    body("title").isString().trim().isLength({ min: 3 }).withMessage("title should at least 3 character long."),
    body("price").isNumeric(),
    body("description").trim().isLength({ min: 5 })
], isAuth, adminController.postAddProduct);

//  /admin/edit-product => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

//   /admin/edit-product =>POST
router.post("/edit-product", [
    body("title").isString().trim().isLength({ min: 3 }).withMessage("title should be at least 3 character long."),
    body("price").isFloat(),
    body("description").trim().isLength({ min: 5 })
], isAuth, adminController.postEditProduct);

//  admin/delete-product =>POST 
router.delete("/product/:productId", isAuth, adminController.deleteProduct);


exports.routes = router;
