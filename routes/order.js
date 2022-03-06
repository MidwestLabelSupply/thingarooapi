const express = require("express");
const router = express.Router();

const verifyToken = require("../AuthCheck");
const { verifyCustomerTokenMiddleware }  = require("../CustomerAuthCheck");
const validMongoDocument = require("../ValidMongoDocument");
const order = require("../controllers/order");

router.post("/add", verifyToken, order.addOrder);

router.get("/", verifyToken, order.getOrders);

router.post("/admin", verifyToken, validMongoDocument, order.getOrder);
router.get(
  "/customer",
  verifyCustomerTokenMiddleware,
  validMongoDocument,
  order.getOrder
);

router.put("/update", verifyToken, validMongoDocument, order.updateOrder);

router.delete("/delete", verifyToken, validMongoDocument, order.deleteOrder);

module.exports = router;
