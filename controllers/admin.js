const Admin = require("../models/admin");
const InvalidToken = require("../models/invalidToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret@123";

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ msg: "username or password is missing." });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).send({ msg: "Invalid Credentials." });

    const passwordIsValid = bcrypt.compareSync(password, admin.password);
    if (!passwordIsValid)
      return res.status(400).send({ msg: "Invalid Credentials." });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET);
    return res.status(200).send({ token });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

async function logout(req, res) {
  try {
    const invalidToken = new InvalidToken({ token: req.body.token });
    const result = await invalidToken.save();

    return res.status(200).send({ msg: "Successfully Logged Out." });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

module.exports = { login, logout };
