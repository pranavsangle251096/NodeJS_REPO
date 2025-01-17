const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://pranavsangle2510:tvzBpYMmUuKberVN@pranavmongodb.otxfb.mongodb.net/?retryWrites=true&w=majority&appName=PranavMongoDB/devTinder"
    );
}

module.exports = connectDB; 

