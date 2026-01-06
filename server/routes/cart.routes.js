const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { applyCouponToCart } = require("../controllers/cart.controller");

router.post("/apply-coupon", auth, applyCouponToCart);

module.exports = router;
