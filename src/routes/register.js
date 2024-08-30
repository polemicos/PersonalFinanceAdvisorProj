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

const createClient = async (req, res) => {
    return new Promise((resolve, reject) => {
        clientController.createClient(req, {
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


module.exports = (app) =>
    app.post("/register", async (req, res) => {
        const { username } = req.body;
        try {
            const client = await getUser(username, res);
            if (client) {
                return res.status(403).json({ error: "There's already a user with such username" });
            }

            const newClient = await createClient(req, res);
            delete newClient.password;
            const token = jwt.signJwt(newClient, process.env.MY_SECRET ? process.env.MY_SECRET : "secret", 1000);
            res.cookie("token", token);

            return res.redirect("homepage");
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Server error" });
        }
    });
