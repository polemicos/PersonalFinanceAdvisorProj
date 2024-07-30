const jwt = require("../middleware/jwt");
const clientController = require("../controllers/client.controller");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");

const getUser = async (username) => {
    return await clientController.getClientByUsername(username);
};

module.exports = (app) => 
    app.post("/register", cookieJwtAuth, async (req, res) => {
        const { username } = req.body;
        try {
            const client = await getUser(username);
            if (client) {
                return res.status(403).json({ error: "there's already a user with such username" });
            }
            
            let newClient = await clientController.createClient(req, res);

            const token = jwt.signJwt(newClient, process.env.MY_SECRET, 1000);

            res.cookie("token", token);

            return res.redirect("homepage");
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Server error" });
        }
    });