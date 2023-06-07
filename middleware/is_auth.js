const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login")
    }
    next();
}

const loggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect("/")
    }
    next();
}

module.exports = {
    isAuth,
    loggedIn
}