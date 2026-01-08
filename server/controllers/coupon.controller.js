const Coupon = require("../models/Couponmodel");

module.exports = {
  createCoupon: async function (req, res) {
    try {

      const coupon = await Coupon.create(req.body);

      res.status(201).json(coupon);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getCoupons: async function (req, res) {
    const coupons = await Coupon.find();
    res.json(coupons);
  },
};
