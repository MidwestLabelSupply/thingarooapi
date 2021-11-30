const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");
const jwt = require("jsonwebtoken");
const ORDER_JWT_SECRET = process.env.ORDER_JWT_SECRET || "orderjwtsecret@123";

const urlGenerator = (quantity, orderId, startCount) => {
  const urls = [];
  for (let i = 1; i <= quantity; ++i) {
    urls.push({
      url: jwt.sign(
        { _id: orderId, unit: i + startCount, time: Date.now },
        ORDER_JWT_SECRET
      ),
      unit: i + startCount,
      customer: null,
    });
  }
  return urls;
};

async function generateUrls(req, res) {
  const { _id } = req.body;
  let result = null;

  try {
    const order = await Order.findOne({ _id });
    if (!order) return res.status(400).send({ msg: "Order Not Found." });

    const orderDetail = await OrderDetail.findOne({ _id });
    if (!orderDetail) {
      const urls = urlGenerator(order.quantity, _id, 0);

      const newOrderDetail = new OrderDetail({
        _id,
        urls,
      });
      result = await newOrderDetail.save();
    } else {
      const prevQuantity = orderDetail.urls.length;
      const newQuantity = order.quantity;

      if (newQuantity < prevQuantity) {
        result = {
          _id,
          urls: orderDetail.urls.slice(0, newQuantity),
        };
      } else {
        const urls = urlGenerator(
          newQuantity - prevQuantity,
          _id,
          prevQuantity
        );

        orderDetail.urls = [...orderDetail.urls, ...urls];
        result = await orderDetail.save();
      }
    }

    return res
      .status(201)
      .send({ msg: "URLs Successfully Generated.", result });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

async function addOrderDetail(req, res) {
  const { _id, unit, firstName, lastName, email, opted, customerToken } =
    req.body;
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
        url: customerToken,
        customer: { firstName, lastName, email, opted },
        unit,
      },
      ...orderDetail.urls.slice(unit),
    ];
    const result = await orderDetail.save();

    const newResult = result.urls[unit - 1] || null;

    return res.status(201).send({
      msg: "OrderDetail Successfully Added.",
      newOrderDetail: newResult,
    });
  } catch (err) {
    return res.status(500).send({ msg: "Internal server error!", err });
  }
}

async function getOrderDetail(req, res) {
  try {
    const { _id, unit } = req.body;
    const orderDetail = await OrderDetail.findOne({ _id });
    if (!orderDetail || unit === undefined)
      return res.status(400).send({ msg: "Order Detail Not Found." });

    const result = orderDetail.urls[unit - 1] || null;

    return res
      .status(200)
      .send({ msg: "Order Detail fetched successfully.", orderDetail: result });
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
  generateUrls,
  getOrderDetail,
  getOrderDetails,
  addOrderDetail,
  updateOrderDetail,
};
