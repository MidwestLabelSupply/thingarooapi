const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");

async function addOrder(req, res) {
  const { companyName, productName, quantity, limitedEdition } = req.body;
  if (!companyName) {
    return res.status(400).send({ msg: "Company Name is mandatory." });
  }

  try {
    const newOrder = new Order({
      companyName,
      productName,
      quantity,
      limitedEdition,
      content: "",
    });
    const result = await newOrder.save();

    const newOrderDetail = new OrderDetail({ _id: result._id, urls: [] });
    await newOrderDetail.save();

    return res
      .status(201)
      .send({ msg: "Order Successfully Added.", newOrder: result });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

async function getOrder(req, res) {
  try {
    const order = await Order.findOne({ _id: req.body._id });
    if (!order) return res.status(400).send({ msg: "Order Not Found." });

    return res.status(200).send({ msg: "Orders fetched successfully.", order });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}
async function getOrders(req, res) {
  try {
    const orders = await Order.find({});

    return res
      .status(200)
      .send({ msg: "Orders fetched successfully.", orders });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

async function updateOrder(req, res) {
  const { _id, companyName, productName, quantity, limitedEdition, content } =
    req.body;
  if (!companyName) {
    return res.status(400).send({ msg: "Company Name is mandatory." });
  }

  try {
    const oldOrder = await Order.findOne({ _id });
    if (!oldOrder) return res.status(400).send({ msg: "Order Not Found." });

    oldOrder.companyName = companyName || oldOrder.companyName;
    oldOrder.productName = productName || oldOrder.productName;
    oldOrder.quantity = quantity === undefined ? oldOrder.quantity : quantity;
    oldOrder.limitedEdition =
      limitedEdition === undefined ? oldOrder.limitedEdition : limitedEdition;
    oldOrder.content = content || oldOrder.content;

    const updatedOrder = await oldOrder.save();

    return res
      .status(201)
      .send({ msg: "Order Successfully Updated.", updatedOrder });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

async function deleteOrder(req, res) {
  try {
    const order = await Order.findOne({ _id: req.body._id });
    if (!order) return res.status(400).send({ msg: "Order Not Found." });

    const result = await Order.deleteOne({ _id: req.body._id });

    return res.status(200).send({ msg: "Order deleted successfully.", result });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

module.exports = {
  getOrder,
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
};
