const express = require('express');
const cookieParser = require("cookie-parser");
//const path = require("path");
require('dotenv').config()

const setupLoginRoute = require("./routes/login");
const setupRegisterRoute = require("./routes/register");
const setupAddRoute = require("./routes/add");
const clientRouter = require("./routes/client.routes");
const loanRouter = require("./routes/loan.routes");
const { getCurrencyList } = require('./controllers/currency.controller');
const app = express();



app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', clientRouter);
app.use('/api', loanRouter);

app.get("/", (req, res) => {
    return res.redirect("homepage");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", async (req, res)=>{
    const currencyList = await getCurrencyList(req, res);
    res.render("register", {
        currencyList: currencyList
    });
});
  
app.get("/homepage", (req, res) => {
    res.render("homepage");
});


app.get("*", (req, res)=>{
    res.send("error!!! No such route!!!");
});


setupLoginRoute(app);
setupAddRoute(app);
setupRegisterRoute(app);








const PORT = process.env.PORT || 3030;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT} --> http://localhost:${PORT}/`)
});