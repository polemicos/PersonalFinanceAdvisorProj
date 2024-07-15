const jwt = require("../middleware/jwt");

const getUser = async (username) => {
  return { userId: 123, password: "123456", username };
};

module.exports = (app) =>
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await getUser(username);

    if (user.password !== password) {
      return res.status(403).json({
        error: "invalid login",
      });
    }

    delete user.password;
    
    const token = jwt.signJwt(user, process.env.MY_SECRET, 1000);

    res.cookie("token", token);

    return res.redirect("welcome");
  });