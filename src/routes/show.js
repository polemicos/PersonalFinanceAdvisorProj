const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const loanController = require("../controllers/loan.controller");
const clientController = require("../controllers/client.controller");
const db = require('../db');

module.exports = (app) => {
    app.post("/show", cookieJwtAuth, async (req, res) => {
        try {
            console.log(req.user);
            let client = await clientController.getClientByUsername(req.user.payload.username);
            let loansList = await loanController.getLoanByClient(client.client_id);
            const query = `
                SELECT c.currency_code
                FROM Client AS cl
                JOIN Currency AS c
                ON cl.preferred_currency_id = c.currency_id
                WHERE cl.client_id = ${client.client_id};
            `;
            let result = await db.query(query);
            let currency_code = result.rows[0]?.currency_code; // Extract currency_code if available
            console.log(currency_code);
            res.render("plans", {
                loansList: loansList,
                user: client.username,
                currency_code: currency_code
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    });
};
