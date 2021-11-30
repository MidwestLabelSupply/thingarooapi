const express = require("express");
const router = express.Router();

const verifyToken = require("../AuthCheck");
const admin = require("../controllers/admin");

router.post("/login", admin.login);

router.post("/logout", verifyToken, admin.logout);

module.exports = router;
