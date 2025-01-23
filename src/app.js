const express = require("express");
const connectDB = require("./config/database");
const app = express(); //This is an instance expressjs application
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

//app.get will strictly handle only GET HTTP Calls
// app.get("/user/:userid", (req,res) =>{
//     console.log(req.query); // this will give us the query parameter given by the Client
//     console.log(req.params); //this will match the dynamic url by directly passing the parameter Value
//     res.send({"firstname" : "Pranav" , "lastname" : "Sangle"});
// });

// app.post("/user" , (req,res) => {
//     res.send("Data saved successfully to the database");
// });

// //app.use will match all the HTTP methods and give the same result while using any HTTP method
// app.use("/test" , (req,res) => {
//     res.send("Hello from Pranav's server")
// }); //app.use is called as request handler / route handlers

// app.use("/hello" , (req,res) => {
//     res.send("Hello Hello Hello");
// }); // Anything after /hello/anything will print the same response from /hello route handler

//order of writing routes is important as code executes from top to bottom and it will take the matching wildcard route and print the same response if the next route has the same wildcard route present in it
app.use(express.json()); // middleware to convert all requests to json
app.use(cookieParser()); // middleware to parse cookies

app.post("/signup" , async (req,res) => {
    // Validation of data and then save to DB
    try{
        validateSignUpData(req);
    //Encrypting the Password
    const { firstName,lastName,emailId,password } = req.body;
    const passwordHashed = await bcrypt.hash(password,10);
    //create a new instance of User Model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password : passwordHashed
    });

        await user.save();
        //await User.create(newUser);
        res.status(201).send("User created successfully");
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }

});

//Login API
app.post("/login" , async(req,res) =>{
    //Get the Email ID and PAssword
    try{

        const { emailId , password } = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid Credentials..");
        }
    
        const isPasswordValid = await bcrypt.compare(password , user.password)
        if(isPasswordValid){
            //Create a JWT Token
            const token = await jwt.sign({ _id : user._id } , "DevTinder@251096_$")

            //Add the Token to a Cookie and then send it back to the user/Client.
            res.cookie("token" , token); // It adds the JWT Token inside a Cookie
            res.send("Login Successfull...");
        }
        else{
            throw new Error("Invalid Credentials..");
        }

    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
 
});

//Profile API to receive Cookie from Client to server
app.get("/profile" , userAuth , async(req,res) =>{

    try{

    const loggedUser = req.user;
    if(!loggedUser){
        throw new Error("Please Login again");
    }
    console.log("Logged in User is : " + loggedUser.firstName + " " + loggedUser.lastName);

    console.log(req.cookies);
    res.send("User Data" + loggedUser);

    }catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
    

});

//Feed API to get all the Users from the DB
app.get("/feed" , async (req,res) => {
    try{
       const fetchedData =  await User.find({});
        res.status(200).send(fetchedData);
    }catch(err){
        res.status(400).send("No Documents found");
    }
    
});

app.get("/feed1" , async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const fetchSingleDocument = await User.findOne({emailId : userEmail}).exec();
        res.status(200).send(fetchSingleDocument);
    }catch(err){
        res.status(400).send("No Document Found");
    }
});

//delete API

app.delete("/user" , async(req,res) =>{
    const userId = req.body._id;
    try{
        const deleteUser = await User.findOneAndDelete(userId);
        res.status(201).send("User Deleted Successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

// Update API
app.patch("/user/:userId" , async(req,res) =>{
    const userId = req.params?.userId;
    const updatedData = req.body;



    try{

        const ALLOWED_UPDATES = [ "about" ,"skills" , "gender" , "age"];

        const isUpdateAllowed = Object.keys(updatedData).every((k)=> ALLOWED_UPDATES.includes(k));
    
        if(!isUpdateAllowed){
            throw new Error("Update not Allowed");
        }

        if(updatedData?.skills.length > 3){
            throw new Error("Skills cannot exceed more than 3");
        }

        await User.findByIdAndUpdate({ _id : userId} , updatedData , {
            runValidators : true
        });
        res.status(201).send("User updated Successfully");
    }catch(err){
        res.status(400).send("Update Failed : " + err.message);
    }
})

//update API using email ID

app.patch("/usere" , async(req,res) =>{
    const emailid = req.body.emailId;
    const data = req.body;

    try{
        await User.findOneAndUpdate({emailId : emailid} , data);
        res.status(201).send("User updated successfully using Email ID");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});




//We should always first make successfull connection to database and then should accept requests on the server
connectDB().then(() => {
    console.log("Connection established successfully..."); 
    app.listen(2510 , () => {
        console.log("Server is listening on port 2510") // This will only be printed if server is up and running
    }); // server is created and it is listening on port 2510 and it will listen to requests from Client 
}).catch((err) =>{
    console.error("Connection to Database Failed");
});


//we can have multiple route handlers for a incoming request.

// app.use("/panu" , (req,res , next) =>{
//     console.log("Welcome to panu route");
//     //res.send("Welcome to Response 1");
//     next(); // next is use to pass the execution to next response handler if we do not handle it in the 1st handler 
//     res.send("Welcome to Response 1");
// },
// (req,res) =>{
//     res.send("Welcome to Response 2");
// });

// app.use("/" , (err,req,res,next) =>{
//     if(err){
//         res.status(500).send("Something went Wrong !!!!!");
//     }
    
// }); // this is how we will handle any error gracefully in any route.