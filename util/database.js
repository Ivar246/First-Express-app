// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "Shop",
//   password: "Root@123",
// });

// module.exports = pool.promise();

// const Sequelize = require("sequelize");

// // instance of mysql database
// const sequelize = new Sequelize("Shop", "root", "Root@123", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// let _db; 

// const MongoConnect = (callback)=>{
// MongoClient.connect("mongodb+srv://ravistha:root123@cluster0.x0jnnah.mongodb.net/?retryWrites=true&w=majority")
// .then(client=>{
//   console.log("connected");
//   _db = client.db();

//   callback();
// })
// .catch(err=>{
//   console.log("Error while connecting mongodb");
//   throw err
// })
// }


// const getDb = () =>{
//   if(_db){
//     return _db;
//   }
//   throw "No database found"
// }

// exports.mongoConnect  = MongoConnect;
// exports.getDb = getDb;
word = "hello";
console.log(word)
let word;