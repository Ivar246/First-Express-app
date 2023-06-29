const mongoose = require('mongoose')


const connectDB = async () => {

    try {
        // mongodb connection string
        const con = await mongoose.connect(process.env.DB, {
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