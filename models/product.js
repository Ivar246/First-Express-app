const mongodb = require("mongodb")
const { getDb } = require("../util/database");

class Product {
  constructor(title, price, description, imageUrl, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  save() {
    const db = getDb();

    return db.collection("products")
      .insertOne(this)
      .then(result => {
        return result;
      })
      .catch(err => console.log(err))
  }

  static fetchAll() {
    const db = getDb();

    return db.collection("products")
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err)
      });
  }

  static fetchOne(prodId) {
    const db = getDb();
    console.log(prodId);
    return db.collection("products")
      .findOne({ _id: new mongodb.ObjectId(prodId) })
      .then(product => {
        if (!product) {
          console.log("cannot find product")

        }
        return product;
      })
      .catch(err => console.log(err))

  }

  static updateById(prodId, object) {
    const db = getDb();
    return db.collection("products").updateOne(
      { _id: new mongodb.ObjectId(prodId) },
      { $set: object }
    )
  }

  static delete(prodId) {
    const db = getDb();
    return db.collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) });
  }
}

module.exports = Product;


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

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Product;
