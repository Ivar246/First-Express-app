const mongoose = require('mongoose')


const connectDB = async () => {

    try {
        // mongodb connection string
        const con = await mongoose.connect("mongodb+srv://ravistha:root123@cluster0.x0jnnah.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        });
        console.log(`MongoDB connected: ${con.connection.host}`)
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;