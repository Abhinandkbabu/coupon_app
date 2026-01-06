const Coupon = require("../models/Couponmodel");
const Order = require("../models/Ordermodel"); // we’ll create model in next step

exports.applyCoupon = async ({
  userId,
  couponCode,
  cartTotal,
}) => {
  const coupon = await Coupon.findOne({ code: couponCode });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (coupon.status !== "ACTIVE") {
    throw new Error("Coupon is not active");
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validTo) {
    throw new Error("Coupon expired");
  }

  if (cartTotal < coupon.minCartAmount) {
    throw new Error("Minimum cart value not met");
  }

  if (coupon.usedCount >= coupon.globalUsageLimit) {
    throw new Error("Coupon usage limit exceeded");
  }

  // Per-user usage check (based on orders)
  const userUsageCount = await Order.countDocuments({
    userId,
    couponCode,
  });

  if (userUsageCount >= coupon.perUserUsageLimit) {
    throw new Error("Per-user coupon limit exceeded");
  }

  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    discount = coupon.discountValue;
  }

  const finalAmount = cartTotal - discount;

  return {
    discount,
    finalAmount,
  };
};
