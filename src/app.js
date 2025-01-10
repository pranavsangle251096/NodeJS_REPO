const express = require("express");

const app = express(); //This is an instance expressjs application

app.use("/test" , (req,res) => {
    res.send("Hello from Pranav's server")
}); //app.use is called as request handler

app.listen(2510 , () => {
    console.log("Server is listening on port 2510") // This will only be printed if server is up and running
}); // server is created and it is listening on port 2510 and it will listen to requests from Client