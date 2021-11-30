const express = require("express");
const router = express.Router();

const verifyToken = require("../AuthCheck");
const verifyCustomerToken = require("../CustomerAuthCheck");
const validMongoDocument = require("../ValidMongoDocument");
const orderDetail = require("../controllers/orderDetail");


router.post("/generate-url", verifyToken, validMongoDocument, orderDetail.generateUrls);

router.post("/add", verifyCustomerToken, validMongoDocument, orderDetail.addOrderDetail);

router.post("/", verifyToken, validMongoDocument, orderDetail.getOrderDetails);

// router.post("/admin", verifyToken, validMongoDocument, orderDetail.getOrderDetail);
router.get(
  "/customer",
  verifyCustomerToken,
  validMongoDocument,
  orderDetail.getOrderDetail
);

router.put("/update", verifyToken, validMongoDocument, orderDetail.updateOrderDetail);

module.exports = router;
