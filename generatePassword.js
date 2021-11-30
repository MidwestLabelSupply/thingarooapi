const bcrypt = require("bcryptjs");

const hashedPassword = bcrypt.hashSync("vivekkM@123");

console.log(hashedPassword);