const path = require("path");
// for parsing text
const bodyParser = require("body-parser");

const express = require("express");

const app = express();

const adminRoutes = require("./routes/admin"); //
const shopRoutes = require("./routes/shop");
// middleware starts
app.use("/", (req, res, next) => {
  res.send("<h1>hello</h1>");
});
app.use("/fol", (req, res, next) => {
  console.log("exercute");
});

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));

// app.use("/admin", adminRoutes);

// app.use(shopRoutes);

// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "error404.html"));
// });
// middleware ends

app.listen(4000);
