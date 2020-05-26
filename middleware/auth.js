const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get the token from header
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({ msg: "Invalid token access denied!!" });
  }

  try {
    const decoded = jwt.verify(token, config.get("Secret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Invalid token" });
  }
};
