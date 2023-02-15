const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/products");

// app.engine(
//   "hbs",
//   hbs.engine({
//     layoutDir: "views/layout/",
//     defaultLayout: "main-layout",
//     extname: ".hbs",
//   })
// );
// app.engine('html', )

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); // serving static file

app.use("/admin", admin.routes);
app.use(shopRoutes);
app.use(errorController.errorHandler);

app.listen(4000);
