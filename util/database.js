// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "Shop",
//   password: "Root@123",
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("Shop", "root", "Root@123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
