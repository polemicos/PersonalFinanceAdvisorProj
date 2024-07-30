const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const loanController = require("../controllers/loan.controller");
const clientController = require("../controllers/client.controller");

module.exports = (app) =>
  app.post("/show", cookieJwtAuth, async (req, res) => {
    console.log(req.user);
    let client = await clientController.getClientByUsername(req.user.payload.username);
    let loansList = await loanController.getLoanByClient(client.client_id);
    res.render("plans",{
      loansList: loansList,
      user: client.username
    });
  });