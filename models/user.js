const mongoose = require("mongoose");
const { populate } = require("./product");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true }
        }]
    }

}, { timestamps: true });

UserSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex != -1) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;

    }
    else {
        updatedCartItems.push({ productId: product._id, quantity: newQuantity })
    }

    const updatedCart = {
        items: updatedCartItems
    };

    this.cart = updatedCart;
    return this.save()

}

UserSchema.methods.removeFromCart = function (prodId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== prodId.toString();
    });

    this.cart.items = updatedCartItems;

    return this.save();
}

UserSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();

}



const User = mongoose.model("User", UserSchema);

module.exports = User;





// const mongodb = require("mongodb")
// const { getDb } = require("../util/database");


// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     console.log(cartProductIndex)
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex != -1) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;

//     }
//     else {
//       updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity })
//     }

//     const updatedCart = {
//       items: updatedCartItems
//     }

//     const db = getDb();
//     return db.collection("users").updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       { $set: { cart: updatedCart } }
//     )

//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(item => {
//       return item.productId;
//     })
//     return db.collection("products").find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(product => {
//           return {
//             ...product, quantity: this.cart.items.find(item => {
//               return item.productId.toString() === product._id.toString();
//             }).quantity
//           }
//         })
//       }).catch(err => console.log(err))
//   }

//   deleteCart(prodId) {

//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== prodId.toString();
//     })

//     const db = getDb();
//     return db.collection('users').updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       { $set: { cart: { items: updatedCartItems } } }
//     )

//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this)
//       .then(result => {
//         return result;
//       })
//       .catch(error => {
//         console.log(error)
//       })
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart().then(products => {
//       const order = {
//         items: products,
//         user: {
//           _id: new mongodb.ObjectId(this._id),
//           name: this.name
//         }
//       }
//       return db.collection("orders").insertOne(order);
//     })
//       .then(result => {
//         this.cart = { items: [] }
//         return db.collection('users').updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         )
//       });
//   }

//   getOrder() {
//     const db = getDb();
//     return db.collection("orders").find({ "user._id": new mongodb.ObjectId(this._id) })
//       .toArray()


//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db.collection("users").findOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(user => {
//         return user;
//       })
//       .catch(error => {
//         console.log(error)
//       });
//   }
// }


// module.exports = User;

// const sequelize = require("../util/database");
// const Sequelize = require("sequelize");

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//     allowNull: false,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = User;
