const mongoose = require("mongoose");

function validMongoDocument(req, res, next) {
  if (mongoose.isValidObjectId(req.body._id)) next();
  else return res.status(400).send({ msg: "Not a valid document." });
}

module.exports = validMongoDocument;
