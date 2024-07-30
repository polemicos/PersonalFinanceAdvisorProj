const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");

module.exports = (app) => 
    app.post("/logout", cookieJwtAuth, (req, res) => {
        res.clearCookie("token");
        return res.redirect("homepage");
    });