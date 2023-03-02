const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "shop",
  password: "Root@123",
});

module.exports = pool.promise();
