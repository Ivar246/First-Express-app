const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

// app.engine(
//   "hbs",
//   hbs.engine({
//     layoutDir: "views/layout/",
//     defaultLayout: "main-layout",
//     extname: ".hbs",
//   })
// );

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); // serving static file

app.use("/admin", admin.routes);
app.use(shopRoutes);
app.use(errorController.errorHandler);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

// telling sequelize to create table if not exist
sequelize
  .sync({ force: true })
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "max", email: "test@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    app.listen(4000);
  })
  .catch((error) => console.log(error));
