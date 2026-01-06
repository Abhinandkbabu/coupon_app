const razorpay = require("../config/razorpay");

exports.createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // INR → paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  return await razorpay.orders.create(options);
};
