const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
});
// __dirname: gives the path pointing to folder containing the active file

module.exports = router;
