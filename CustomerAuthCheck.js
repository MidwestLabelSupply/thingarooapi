const jwt = require("jsonwebtoken");
const ORDER_JWT_SECRET = process.env.ORDER_JWT_SECRET || "orderjwtsecret@123";


const validateUserToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, ORDER_JWT_SECRET, (err, decoded) => {
      if (err) reject({ err });
      resolve(decoded);
    });
  })

}


function customerAuthMiddleware(req, res, next) {
  const [bearer, customerToken] = req.headers.authorization
    ? req.headers.authorization.split(" ")
    : [];

  if (bearer !== "Bearer" || !customerToken) {
    return res.status(401).send({ msg: "bad credentials provided." });
  }

  validateUserToken(customerToken)
    .then((decoded) => {
    req.body._id = decoded._id;
    req.body.unit = decoded.unit;
    req.body.customerToken = customerToken;
    next();

  })
    .catch((err) => {
      return res.status(401).send({ msg: "bad credentials provided." });
    });

}

module.exports = { customerAuthMiddleware, validateUserToken } ;
