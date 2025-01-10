const express = require("express");

const app = express(); //This is an instance expressjs application

//app.get will strictly handle only GET HTTP Calls
app.get("/user/:userid", (req,res) =>{
    console.log(req.query); // this will give us the query parameter given by the Client
    console.log(req.params);
    res.send({"firstname" : "Pranav" , "lastname" : "Sangle"});
});

app.post("/user" , (req,res) => {
    res.send("Data saved successfully to the database");
});

//app.use will match all the HTTP methods and give the same result while using any HTTP method
app.use("/test" , (req,res) => {
    res.send("Hello from Pranav's server")
}); //app.use is called as request handler / route handlers

app.use("/hello" , (req,res) => {
    res.send("Hello Hello Hello");
}); // Anything after /hello/anything will print the same response from /hello route handler

//order of writing routes is important as code executes from top to bottom and it will take the matching wildcard route and print the same response if the next route has the same wildcard route present in it

app.listen(2510 , () => {
    console.log("Server is listening on port 2510") // This will only be printed if server is up and running
}); // server is created and it is listening on port 2510 and it will listen to requests from Client