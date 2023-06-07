const User = require("../models/user")
const bcrypt = require("bcryptjs")
const { isValidEmail } = require("../validator/validate")

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get("Cookie")
    //     .split("=").pop() === "true";
    let message = req.flash("error");
    let success = req.flash("success");
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        successMessage: success.length === 0 ? null : success[0],
        errorMessage: (message.length === 0) ? null : message[0]
    })

}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                (!isValidEmail(email)) ? req.flash("error", "Invalid email") :
                    req.flash("error", "user with the email doesn't exist");


                return res.redirect("/login");
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
                    req.flash("error", "Password is incorrect!")
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
        errorMessage: message.length === 0 ? null : message[0]
    });
}

exports.postSignup = (req, res, next) => {
    const { email, password, confirm_password } = req.body;
    if (!isValidEmail(email)) {
        req.flash("error", "invalid email!");
        return res.redirect("/signup")
    }
    User.findOne({ email: email })
        .then(userDoc => {

            if (userDoc) {
                req.flash("error", "email already exist.")
                return res.redirect("/signup")
            }
            return bcrypt.hash(password, 12)
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
        })

        .catch(error => console.log(error))


}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect("/")
    })
}



