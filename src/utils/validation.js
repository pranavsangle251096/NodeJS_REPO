const validator = require("validator"); // Validator Library to implement checks

const validateSignUpData = (req) => {
    const  {firstName , lastName , emailId , password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not Valid");
    }
    else if(firstName.length < 4 || firstName.length > 20){
        throw new Error("Firstname length should be 4-20 characters ");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email ID is invalid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a Strong Password")
    }
}

module.exports = {
    validateSignUpData
}