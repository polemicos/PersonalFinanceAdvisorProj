const express = require('express');
const cookieParser = require("cookie-parser");
require('dotenv').config()

const setupLoginRoute = require("./routes/login");
const setupLogoutRoute = require("./routes/logout");
const setupRegisterRoute = require("./routes/register");
const setupShowRoute = require("./routes/show");
const setupNewLoanRoute = require("./routes/newLoan");
const clientRouter = require("./routes/client.routes");
const loanRouter = require("./routes/loan.routes");
const { getCurrencyList } = require('./controllers/currency.controller');
const { cookieJwtAuth } = require('./middleware/cookieJwtAuth');
const app = express();



app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', clientRouter);
app.use('/api', loanRouter);

app.get("/", (req, res) => {
    return res.redirect("homepage");
});

app.get("/login", cookieJwtAuth, (req, res) => {
    res.render("login", {
        user: req.user.payload ? req.user.payload.username : null
    });
});

app.get("/register", cookieJwtAuth, async (req, res)=>{
    const currencyList = await getCurrencyList(req, res);
    res.render("register", {
        currencyList: currencyList,
        user: req.user.payload ? req.user.payload.username : null
    });
});
  
app.get("/homepage", cookieJwtAuth, (req, res) => {
    //console.log(req.user);
    res.render("homepage", {
        user: req.user && req.user.payload ? req.user.payload.username : null
    });
});


app.get("*", (req, res)=>{
    res.send("error!!! No such route!!!");
});


setupLoginRoute(app);
setupShowRoute(app);
setupRegisterRoute(app);
setupNewLoanRoute(app);
setupLogoutRoute(app);








const PORT = process.env.PORT || 3030;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT} --> http://localhost:${PORT}/`)
});