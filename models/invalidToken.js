const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const InvalidTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Model
const InvalidToken = mongoose.model("InvalidToken", InvalidTokenSchema);

module.exports = InvalidToken;
