const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const OrderDetailSchema = new Schema(
  {
   templateUnits: Schema.Types.Mixed,
  }
);

// Model
const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);

module.exports = OrderDetail;
