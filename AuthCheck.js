const InvalidToken = require("./models/invalidToken");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret@123";

function verifyToken(req, res, next) {
  const [bearer, token] =
    req.headers && req.headers.authorization
      ? req.headers.authorization.split(" ")
      : [];

  if (bearer !== "Bearer" || !token) {
    return res.status(401).send({ msg: "bad credentials provided." });
  }
  jwt.verify(token, JWT_SECRET, async function (err, decoded) {
    if (err) return res.status(401).send({ msg: "bad credentials provided." });

    try {
      const invalidToken = await InvalidToken.findOne({ token });
      if (!invalidToken) {
        req.body.token = token;
        next();
      } else return res.status(401).send({ msg: "Invalid Credentials." });
    } catch (err) {
      return res.status(500).send({ msg: "Internal server error!", err });
    }
  });
}

module.exports = verifyToken;
