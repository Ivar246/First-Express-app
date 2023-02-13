const path = require("path");
const bodyParser = require("body-parser"); // for parsing text
const express = require("express");
const app = express();

const admin = require("./routes/admin"); //
const shopRoutes = require("./routes/shop");

const hbs = require("hbs");

app.set("view engine", "hbs");
app.set("views", "views");

// middleware starts
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public"))); // serving static file

app.use("/admin", admin.routes);

app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});
// middleware ends

app.listen(4000);
