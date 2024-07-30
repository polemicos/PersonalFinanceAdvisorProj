const jwt = require("../middleware/jwt");
const clientController = require("../controllers/client.controller");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");

const getUser = async (username) => {
    return await clientController.getClientByUsername(username);
};

module.exports = (app) => 
    app.post("/login", cookieJwtAuth, async (req, res) => {
        const { username, password } = req.body;
        try {
            const client = await getUser(username);
            if (!client || client.password !== password) {
                return res.status(403).json({ error: "invalid login" });
            }

            delete client.password;

            const token = jwt.signJwt(client, process.env.MY_SECRET, 1000);

            res.cookie("token", token);

            return res.redirect("homepage");
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Server error" });
        }
    });
