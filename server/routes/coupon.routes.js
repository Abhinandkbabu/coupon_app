const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const couponController = require("../controllers/coupon.controller");

router.post("/create", auth, role("admin"), couponController.createCoupon);
router.get("/", auth, role("admin"), couponController.getCoupons);

module.exports = router;
