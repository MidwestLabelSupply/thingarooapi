const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Model
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
