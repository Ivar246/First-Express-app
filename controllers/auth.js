const User = require("../models/user")
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
    User.findById("6479db820b5953c576f2edd2")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect("/")
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect("/")

    })
}