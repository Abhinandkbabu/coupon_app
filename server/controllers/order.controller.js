const crypto = require("crypto");
const Order = require("../models/Ordermodel");
const Coupon = require("../models/Couponmodel");
const { createRazorpayOrder } = require("../services/payment.service");

exports.placeOrder = async (req, res) => {
  const {
    cartItems,
    originalAmount,
    discountAmount,
    finalAmount,
    couponCode,
  } = req.body;

  // Create Razorpay order
  const razorpayOrder = await createRazorpayOrder(finalAmount);

  const order = await Order.create({
    userId: req.user.id,
    cartItems,
    originalAmount,
    discountAmount,
    finalAmount,
    couponCode,
    razorpayOrderId: razorpayOrder.id,
  });

  res.json({
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    key: process.env.RAZORPAY_KEY_ID,
  });
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

  order.paymentStatus = "SUCCESS";
  await order.save();

  // Increase coupon usage AFTER payment success
  if (order.couponCode) {
    await Coupon.updateOne(
      { code: order.couponCode },
      { $inc: { usedCount: 1 } }
    );
  }

  res.json({ message: "Payment successful" });
};
