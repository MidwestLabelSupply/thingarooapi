const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const OrderDetailSchema = new Schema(
  {
    templateUnits: Schema.Types.Mixed,
    urls: [
      {
        url: {
          type: String,
          required: true,
        },
        customer: {
          firstName: String,
          lastName: String,
          email: String,
          opted: Boolean
        },
        unit: {
          type: Number,
          required: true,
        },
      }
    ],
  },
  { timestamps: true }
);

// Model
const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);

module.exports = OrderDetail;
