const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const loanController = require("../controllers/loan.controller");
const clientController = require("../controllers/client.controller");
const db = require('../db');


const getUser = async (username, res) => {
    return new Promise((resolve, reject) => {
        clientController.getClientByUsername(username, {
            json: (data) => resolve(data),
            status: (code) => ({ json: (error) => reject(error) })
        });
    });
};

const getLoanByClient = async (req) => {
    return new Promise((resolve, reject) => {
        loanController.getLoanByClient(req, {
            status: (code) => ({
                json: (data) => {
                    if (code >= 200 && code < 300) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }
            })
        });
    });
};

module.exports = (app) => {
    app.post("/show", cookieJwtAuth, async (req, res) => {
        try {
            console.log(req.user);
            const client = await getUser(req.user.payload.username);
            req.body.client_id = client.client_id;
            const loansList = await getLoanByClient(req);
            const query = `
                SELECT c.currency_code
                FROM Client AS cl
                JOIN Currency AS c
                ON cl.preferred_currency_id = c.currency_id
                WHERE cl.client_id = ${client.client_id};
            `;
            let result = await db.query(query);
            let currency_code = result.rows[0]?.currency_code;
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
