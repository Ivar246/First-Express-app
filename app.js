// express setup import
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

// routes
const admin = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// const errorController = require("./controllers/error");

// database import
// const sequelize = require("./util/database");
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/orders");
// const OrderItem = require("./models/orderItem");

const { mongoConnect } = require("./util/database")
const User = require("./models/user")

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

app.use((req, res, next) => {
  User.findById("6477811d873a976534b2c261")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((error) => console.log(error));
});

// parser
app.use(bodyParser.urlencoded({ extended: false }));

// serving static file
app.use(express.static(path.join(__dirname, "public")));

// paths to sub paths
app.use("/admin", admin.routes);
app.use(shopRoutes);
// app.use(errorController.errorHandler);

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


mongoConnect(() => {

  app.listen(3000);
})