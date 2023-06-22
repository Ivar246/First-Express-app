const express = require("express");
const { check, body } = require("express-validator")
const router = express.Router();
const authContorllers = require("../controllers/auth")
const { isAuth, loggedIn } = require("../middleware/is_auth")
const User = require("../models/user")


router.get('/login', loggedIn, authContorllers.getLogin);

router.post("/login",
    [
        body("email").isEmail().withMessage("Invalid Email").normalizeEmail(),
        body("password", "Password should be valid").isLength({ min: 5 }).isAlphanumeric()
    ],
    authContorllers.postLogin)

router.post("/logout", isAuth, authContorllers.postLogout)

router.get("/signup", loggedIn, authContorllers.getSignup)

router.post("/signup",
    [check("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((value, { req }) => {
            // if (value === "test@gmail.com") {
            //     throw new Error("this email address is forbidden.")
            // }
            return User.findOne({ email: value })
                .then(userDoc => {

                    if (userDoc) {
                        return Promise.reject("E-mail already exist, please pick a different one.");
                    }
                })
        }).normalizeEmail(),
    body("password", "Please enter a password with only numbers and text and at least 5 characters")
        .isLength({ min: 6 })
        .isAlphanumeric().trim(),

    body("confirm_password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords doesn't match");
            }
            return true
        }).trim()

    ],
    authContorllers.postSignup
)

router.get("/reset", authContorllers.getReset)

router.post("/reset", authContorllers.postReset)

router.get("/reset/:token", authContorllers.getNewPassword)

router.post("/new-password", authContorllers.postNewPassword)
module.exports = router