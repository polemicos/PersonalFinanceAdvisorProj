const jwt = require(".//jwt");

exports.cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verifyJwt(token, process.env.MY_SECRET ? process.env.MY_SECRET : "secret");
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/");
  }
};