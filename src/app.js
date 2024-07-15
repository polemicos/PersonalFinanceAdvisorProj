const express = require('express');
const cookieParser = require("cookie-parser");
const path = require("path");
const mongo = require("mongoose");
require('dotenv').config()

const setupLoginRoute = require("./routes/login");
const setupAddRoute = require("./routes/add");

const app = express();


app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(cookieParser());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
  
app.get("/welcome", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/welcome.html"));
});



setupLoginRoute(app);
setupAddRoute(app);








const PORT = 3030;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT} --> http://localhost:${PORT}/`)
});