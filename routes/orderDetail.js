const express = require("express");
const router = express.Router();

const verifyToken = require("../AuthCheck");
const { customerAuthMiddleware } = require("../CustomerAuthCheck");
const validMongoDocument = require("../ValidMongoDocument");
const orderDetail = require("../controllers/orderDetail");

/* Not working the function doesnt exist? */
// router.post("/generate-url", verifyToken, validMongoDocument, orderDetail.generateUrls);

router.post("/add", customerAuthMiddleware, validMongoDocument, orderDetail.addOrderDetail);

router.post("/", verifyToken, validMongoDocument, orderDetail.getOrderDetails);

router.post("/admin", verifyToken, validMongoDocument, orderDetail.getOrderDetail);

router.get(
  "/customer/:token",
  orderDetail.getCustomerOrderDetails
);

router.get(
  "/customer",
  customerAuthMiddleware,
  validMongoDocument,
  orderDetail.getOrderDetail
);

router.put("/update", verifyToken, validMongoDocument, orderDetail.updateOrderDetail);

module.exports = router;
