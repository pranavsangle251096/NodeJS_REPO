const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) =>{
    try{
        const {token} = req.cookies; //Obtain the token from req.cookies
        if(!token){
            throw new Error("Token is Invalid");
        }
        const decodedObj = await jwt.verify(token , "DevTinder@251096_$");//verfiy the token using obtained token and secret Key
        const {_id} = decodedObj; // extract the unique id from decoded object

        const user = await User.findById(_id);
        if(!user){
            throw new Error("Invalid Credentials..");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }



}



module.exports = {
    userAuth
}