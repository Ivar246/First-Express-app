exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get("Cookie")
        .split("=").pop() === "true";
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    })

}

exports.postLogin = (req, res, next) => {
    res.setHeader("Set-Cookie", "loggedIn=true; httpOnly");
    res.redirect("/")

}