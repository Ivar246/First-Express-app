const mongoose = require("mongoose");
const { schema } = require("./product");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  products: [{
    productData: { type: Object, required: true },
    quantity: { type: Number, required: true }
  }],
  user: {
    name: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  }
});


module.exports = mongoose.model("Order", OrderSchema);




// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Order = sequelize.define("order", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
// });

// module.exports = Order;
