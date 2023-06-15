const crypto = require("crypto");
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")

const User = require("../models/user")
const sendMail = require("../util/nodemailer");

exports.getLogin = (req, res, next) => {

    let message = req.flash("error");
    let success = req.flash("success");
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        successMessage: success.length === 0 ? null : success[0],
        errorMessage: (message.length === 0) ? null : message[0],
        oldInput: {
            email: '',
            password: ''
        },
        validationError: {}
    })

}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login", {
            pageTitle: "Login",
            path: "/login",
            errorMessage: errors.array()[0].msg,
            successMessage: '',
            oldInput: {
                email,
                password
            },
            validationError: errors.array()[0]
        })
    }



    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).render("auth/login", {
                    pageTitle: "Login",
                    path: "/login",
                    errorMessage: "user with that email doesn't exist",
                    successMessage: '',
                    oldInput: {
                        email,
                        password
                    },
                    validationError: {}
                });
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;

                        return req.session.save(error => {
                            console.log(error)
                            req.flash("success", "loggedIn successfully!")
                            return res.redirect("/")
                        })
                    }
                    req.flash("error", "password doesn't match with your email!")
                    return res.redirect("/login");
                })
                .catch(err => {
                    console.log(err);
                    res.redirect("/login")
                })

        })
        .catch(err => console.log(err))
}

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "SignUp",
        oldInput: {
            email: "",
            password: "",
            confirm_password: ""
        },
        errorMessage: message.length === 0 ? null : message[0],
        validationError: {}
    });
}

exports.postSignup = (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].path)
        return res.status(422).render("auth/signup", {
            path: "/signup",
            pageTitle: "SignUp",
            oldInput: { email: email, password: password, confirm_password: req.body.confirm_password },
            errorMessage: errors.array()[0].msg,
            validationError: errors.array()[0]
        })
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {

            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save()
                .then(sucess => {
                    req.flash("success", "User registered successfully.")
                    res.redirect("/login")
                })
                .catch(error => console.log(error));
        });
}


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect("/")
    });
}


exports.getReset = (req, res, next) => {
    let message = req.flash("error");
    if (message.length === 0) {
        message = null;
    } else {
        message = message[0]
    }
    res.render("auth/reset", {
        path: "/reset",
        pageTitle: "Reset",
        errorMessage: message
    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/reset")
        }
        console.log(buffer.toString("base64"))
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash("error", "No account with that email found.")
                    return res.redirect("/reset");
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 1800000;
                return user.save();
            })
            .then(result => {

                const emailBody = {
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                     `
                }
                res.redirect('/');

                sendMail(...Object.values(emailBody));
            })
            .catch(err => console.log(err))
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            const message = req.flash("error")
            res.render("auth/new-password", {
                path: "/reset",
                pageTitle: "New Password",
                errorMessage: message.length === 0 ? null : message[0],
                userId: user._id.toString(),
                resetToken: token


            })
        })
        .catch(error => console.log(error))

}

exports.postNewPassword = (req, res, next) => {
    const { userId, password, resetToken } = req.body;

    User.findOne({
        resetToken: resetToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.resetToken = null;
                    user.resetTokenExpiration = null;
                    user.save();
                    req.flash("success", "Password updated Successfully.")
                    res.redirect("/login")

                })
                .catch(error => console.log(error))
        })
        .catch(error => console.log(error));
}