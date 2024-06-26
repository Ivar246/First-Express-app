// express setup import
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer")
const dotenv = require("dotenv");

dotenv.config({ path: './.env' })

// routes
const admin = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

const connectDB = require("./connection")

const User = require("./models/user")
const upload = require("./middleware/upload")

const store = new MongoDBStore({
    uri: process.env.DB,
    collection: 'session',
});

const csrfProtection = csrf()

// module.exports = multer({ storage: storage, fileFilter: fileFilter }).single("image")


// parser
app.use(upload)
app.use(bodyParser.urlencoded({ extended: false }));



// database import
// const sequelize = require("./util/database");
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/orders");
// const OrderItem = require("./models/orderItem");

// const { mongoConnect } = require("./util/database")

// app.engine(
//   "hbs",
//   hbs.engine({
//     layoutDir: "views/layout/",
//     defaultLayout: "main-layout",
//     extname: ".hbs",
//   })
// );



// template setting
app.set("view engine", "ejs");
app.set("views", "views");

// serving static file
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")))
// session middleware config
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})


// user
app.use((req, res, next) => {
    if (!req.session.user) return next();
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err))
        })

});



// paths to sub paths
app.use("/admin", admin.routes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", errorController.get500)
app.use(errorController.errorHandler);


app.use((error, req, res, next) => {
    res.status(500).render("500", {
        pageTitle: "Error",
        path: "/500",
        isAuthenticated: true
    });
})





// mongoose connection

// Associations between models(relation between tables)
// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);

// Cart.belongsTo(User);
// User.hasOne(Cart);

// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// Order.belongsTo(User);
// User.hasMany(Order);

// Order.belongsTo(Product, { through: OrderItem });
// Product.belongsTo(Order, {through:OrderItem})

// telling sequelize to create table if not exist
// sequelize
//   .sync({ force: false })
//   .then((result) => {
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: "max", email: "test@gmail.com" });
//     }
//     return user;
//   })
//   .then((user) => {
//     return user.createCart();
//   })
//   .then((cart) => {
//     app.listen(3000, () => {
//       console.log("listening on port 3000");
//     });
//   })
//   .catch((error) => console.log(error));

connectDB();


app.listen(8000);