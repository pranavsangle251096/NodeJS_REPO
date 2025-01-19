const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    firstName : {
        type : String,
        required : true,
        unique: true
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        lowercase: true,
        required: true,
        unique: true,
    },
    password : {
        type : String,
        required: true
    },
    age : {
        type : Number,
        min: 18,
        max:35
    },
    gender : {
        type : String,
        lowercase : true,
        validate(value){
            if(!["male", "female","others"].includes(value)){
                throw new Error("Gender is invalid");
            }
        }
    },
    photoUrl : {
        type : String
    },
    about : {
        type : String,
        default : "This is Default Information about the User"
    },
    skills : {
        type : [String]
    }

});

const User = mongoose.model("User" , userSchema);

module.exports = User;