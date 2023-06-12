const express = require("express");
const router = express.Router();
const authContorllers = require("../controllers/auth")
const { loggedIn } = require("../middleware/is_auth")

router.get('/login', loggedIn, authContorllers.getLogin);

router.post("/login", authContorllers.postLogin)

router.post("/logout", authContorllers.postLogout)

router.get("/signup", loggedIn, authContorllers.getSignup)

router.post("/signup", authContorllers.postSignup)

router.get("/reset", authContorllers.getReset)

router.post("/reset", authContorllers.postReset)

router.get("/reset/:token", authContorllers.getNewPassword)

router.post("/new-password", authContorllers.postNewPassword)
module.exports = router