const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const loanController = require("../controllers/loan.controller");
const clientController = require("../controllers/client.controller");

module.exports = (app) =>
  app.post("/newLoan", cookieJwtAuth, async (req, res) => {
    console.log(req.user);
    let user = req.user.payload.username;
    let id = req.user.payload.client_id;
    res.render("newLoan",{
        user: user,
        id: id
    });
  });