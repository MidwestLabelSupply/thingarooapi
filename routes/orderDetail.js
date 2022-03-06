const express = require("express");
const router = express.Router();

const verifyToken = require("../AuthCheck");
const { verifyCustomerTokenMiddleware } = require("../CustomerAuthCheck");
const validMongoDocument = require("../ValidMongoDocument");
const orderDetail = require("../controllers/orderDetail");


// router.post("/generate-url", verifyToken, validMongoDocument, orderDetail.generateUrls);

router.post("/add", verifyCustomerTokenMiddleware, validMongoDocument, orderDetail.addOrderDetail);

// router.post("/", verifyToken, validMongoDocument, orderDetail.getOrderDetails);

// router.post("/admin", verifyToken, validMongoDocument, orderDetail.getOrderDetail);
router.get(
  "/customer/:token",
  validMongoDocument,
  orderDetail.getOrderDetail
);

// router.put("/update", verifyToken, validMongoDocument, orderDetail.updateOrderDetail);

module.exports = router;
