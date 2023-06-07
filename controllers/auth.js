const User = require("../models/user")
const bcrypt = require("bcryptjs")
const { isValidEmail } = require("../validator/validate")

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get("Cookie")
    //     .split("=").pop() === "true";
    let message = req.flash("error");
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',

        errorMessage: (message.length === 0) ? null : message
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
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "SignUp",
    });
}

exports.postSignup = (req, res, next) => {
    const { email, password, confirm_password } = req.body;
    User.findOne({ email: email })
        .then(userDoc => {

            if (userDoc) {
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



