const jwt = require("../middleware/jwt");
const clientController = require("../controllers/client.controller");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");

const getUser = async (username, res) => {
    return new Promise((resolve, reject) => {
        clientController.getClientByUsername(username, {
            json: (data) => resolve(data),
            status: (code) => ({ json: (error) => reject(error) })
        });
    });
};

module.exports = (app) =>
    app.post("/login", async (req, res) => {
        const { username, password } = req.body;
        try {
            const client = await getUser(username, res);
            if (!client || client.password !== password) {
                return res.status(403).json({ error: "invalid login" });
            }

            delete client.password;

            const token = jwt.signJwt(client, process.env.MY_SECRET ? process.env.MY_SECRET : "secret", 1000);

            res.cookie("token", token);

            return res.redirect("homepage");
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Server error" });
        }
    });
