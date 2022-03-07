const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");
const ProcessHistory = require('../models/templates/processHistory');
const { validateUserToken } = require("../CustomerAuthCheck");
const mongoose = require("mongoose");


async function addOrderDetail(req, res) {
  const { _id, unit, content, imageUrl, dateTime } = req.body;

  try {
    const orderDetail = await OrderDetail.findOne({ _id });
    if (!orderDetail) return res.status(400).send({ msg: "Order Not Found." });

    const { notes, isCompleted } = orderDetail.templateUnits[unit - 1];
    const processHistory = new ProcessHistory(notes);
    processHistory.addNote(content, imageUrl, dateTime);

    orderDetail.templateUnits[unit - 1] = processHistory;
    orderDetail.markModified('templateUnits');  // to let mongo know this has changed, as mongo doesn't detech by default.

    const updatedOrderDetail = await orderDetail.save();


    return res.status(201).send({
      msg: "OrderDetail Successfully Added.",
      newOrderDetail: updatedOrderDetail,
    });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

async function getOrderDetail(req, res) {
  try {
    const { _id, unit } = await validateUserToken(req.params.token);
    if (!mongoose.isValidObjectId(_id)) return res.status(404).send({ msg: "Not found :( !" });
    const orderDetail = await OrderDetail.findOne({ _id });
    const order =  await Order.findOne({_id});

    if (!orderDetail || unit === undefined || !order)
      return res.status(400).send({ msg: "Order Detail Not Found." });

    const { notes } = orderDetail.templateUnits[unit - 1] || null;
    res.render('history.html', { 
      unitNumber: unit,  
      notes, 
      productThumbnail: "https://media.istockphoto.com/vectors/male-hand-holding-glass-beer-and-antique-pocket-watch-vector-id698271744?s=612x612",
      productName: order.productName
    })
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}
async function getOrderDetails(req, res) {
  try {
    const { _id } = req.body;
    const orderDetail = await OrderDetail.findOne({ _id });
    if (!orderDetail)
      return res.status(400).send({ msg: "Order Details Not Found." });

    const urls = orderDetail.urls.filter((row) => row.customer.firstName);
    orderDetail.urls = urls;

    return res
      .status(200)
      .send({ msg: "OrderDetails fetched successfully.", orderDetail });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

async function updateOrderDetail(req, res) {
  const { _id, unit, url, firstName, lastName, email, opted } = req.body;
  if (!firstName) {
    return res.status(400).send({ msg: "First Name is mandatory." });
  }
  if (unit === undefined) {
    return res.status(400).send({ msg: "Unit is mandatory." });
  }

  try {
    const orderDetail = await OrderDetail.findOne({ _id });
    if (!orderDetail) return res.status(400).send({ msg: "Order Not Found." });

    orderDetail.urls = [
      ...orderDetail.urls.slice(0, unit - 1),
      {
        url,
        customer: { firstName, lastName, email, opted },
        unit,
      },
      ...orderDetail.urls.slice(unit),
    ];
    const result = await orderDetail.save();

    const newResult = result.urls[unit - 1] || null;

    return res.status(201).send({
      msg: "OrderDetail Successfully Updated.",
      newOrderDetail: newResult,
    });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

module.exports = {
  getOrderDetail,
  getOrderDetails,
  addOrderDetail,
  updateOrderDetail,
};
