const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true
    },
    templateId: {
      type: String
    }
  },
  { timestamps: true }
);

// Model
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
