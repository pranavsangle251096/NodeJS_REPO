const express = require("express");
const connectDB = require("./config/database");
const app = express(); //This is an instance expressjs application
const User = require("./models/user");

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
app.post("/signup" , async (req,res) => {


    //create a new instance of User Model
    const user = new User(req.body); // req.body is to dynamically pass json object

    await user.save().then(()=>{
        res.send("Data Saved Successfully")
    }).catch((err)=>{
        res.send("Data not saved");
    });



});

//Feed API to get all the Users from the DB
app.get("/feed" , async (req,res) => {
    try{
       const fetchedData =  await User.find({});
        res.status(200).send(fetchedData);
    }catch(err){
        res.status(400).send("No Documents found");
    }
    
})









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