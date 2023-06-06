const User = require("../models/user")
const bcrypt = require("bcryptjs")

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get("Cookie")
    //     .split("=").pop() === "true";
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })

}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect("/login");
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;

                        return req.session.save(error => {
                            console.log(error)
                            return res.redirect("/")
                        })
                    }
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
        isAuthenticated: false
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



