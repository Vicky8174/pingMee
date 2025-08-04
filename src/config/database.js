const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://Holy_Cow:7HnoyP2XfqONabso@cluster0.mkczrg6.mongodb.net/pingMe_Database")
}

module.exports = connectDB;