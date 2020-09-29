const mongoose = require('mongoose');

const URI = "mongodb+srv://sudamkwagh:chhatrpati1630@cluster0.sr1oh.mongodb.net/Govindji?retryWrites=true&w=majority";

const connectDB = async() =>{
    await mongoose.connect(URI, {
        useUnifiedTopology: true,
        useNewUrlParser : true
    });
    console.log("Database connected..............");
}

module.exports = connectDB;