const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");
const ProcessHistory = require('../models/templates/processHistory');


async function addOrderDetail(req, res) {
  const { _id, unit, content, imageUrl } = req.body;

  try {
    const orderDetail = await OrderDetail.findOne({ _id });
    if (!orderDetail) return res.status(400).send({ msg: "Order Not Found." });
    
    const  { notes, isCompleted } = orderDetail.templateUnits[unit - 1];
    const processHistory = new ProcessHistory(notes);
    processHistory.addNote(content, imageUrl);

    orderDetail.templateUnits[unit - 1] = processHistory;
    orderDetail.markModified('templateUnits');  // to let mongo know this has changed, as mongo doesn't detech by default.

    const updatedOrderDetail = await orderDetail.save();

    
    return res.status(201).send({
      msg: "OrderDetail Successfully Added.",
      newOrderDetail: updatedOrderDetail,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

async function getOrderDetail(req, res) {
  try {
    const { _id, unit } = req.body;
    console.log(_id, unit);

    const orderDetail = await OrderDetail.findOne({ _id });

    if (!orderDetail || unit === undefined)
      return res.status(400).send({ msg: "Order Detail Not Found." });

    const { notes } = orderDetail.templateUnits[unit - 1] || null;
    console.log({...notes[0]});
    res.render('test.html', { ...notes[0] })
  } catch (err) {
    console.log(err)
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
