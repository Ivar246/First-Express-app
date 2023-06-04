const express = require("express");
const router = express.Router();
const authContorllers = require("../controllers/auth")


router.get('/login', authContorllers.getLogin);
router.post("/login", authContorllers.postLogin)
module.exports = router