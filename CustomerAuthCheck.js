const jwt = require("jsonwebtoken");
const ORDER_JWT_SECRET = process.env.ORDER_JWT_SECRET || "orderjwtsecret@123";

function verifyCustomerToken(req, res, next) {
  const [bearer, customerToken] = req.headers.authorization
    ? req.headers.authorization.split(" ")
    : [];
  if (bearer !== "Bearer" || !customerToken) {
    return res.status(401).send({ msg: "bad credentials provided." });
  }

  jwt.verify(customerToken, ORDER_JWT_SECRET, async function (err, decoded) {
    if (err) return res.status(401).send({ msg: "bad credentials provided." });
    
    req.body._id = decoded._id;
    req.body.unit = decoded.unit;
    req.body.customerToken = customerToken;
    next();
  });
}

module.exports = verifyCustomerToken;
