const { applyCoupon } = require("../services/coupon.service");

exports.applyCouponToCart = async (req, res) => {
  try {
    const { couponCode, cartTotal } = req.body;

    if (!couponCode || !cartTotal) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const result = await applyCoupon({
      userId: req.user.id,
      couponCode: couponCode.toUpperCase(),
      cartTotal,
    });

    res.json({
      originalAmount: cartTotal,
      discountAmount: result.discount,
      finalAmount: result.finalAmount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
