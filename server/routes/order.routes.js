const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const {
  placeOrder,
  verifyPayment,
} = require("../controllers/order.controller");

router.post("/", auth, placeOrder);
router.post("/verify", auth, verifyPayment);

module.exports = router;
