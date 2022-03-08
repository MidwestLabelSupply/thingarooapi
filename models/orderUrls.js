const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const OrderUrlsSchema = new Schema(
  {
    urls: [
      {
        url: {
          type: String,
          required: true,
        },
      }
    ]
  }
);

// Model
const OrderUrls = mongoose.model("OrderUrls", OrderUrlsSchema);

module.exports = OrderUrls;
