const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "shop",
  password: "Root@123",
});

module.exports = pool.promise();
