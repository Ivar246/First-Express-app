// const db = require("../util/database");

// const Cart = require("./cart");

// module.exports = class Product {
//   constructor(productId, title, desc, price, imgUrl) {
//     this.productId = productId;
//     this.title = title;
//     this.description = desc;
//     this.price = price;
//     this.imgUrl = imgUrl;
//   }

//   save() {
//     return db.execute(
//       "INSERT INTO products(title, descriptions, imageUrl, price) VALUES(?,?,?,?)",
//       [this.title, this.description, this.imgUrl, this.price]
//     );
//   }

//   static deleteById(id) {}

//   static fetchAll(cb) {
//     return db.execute("SELECT * FROM products");
//   }

//   static findById(id) {
//     return db.execute("SELECT * FROM products WHERE id = ?", [id]);
//   }
// };

const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
