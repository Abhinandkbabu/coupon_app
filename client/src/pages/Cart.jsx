import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";
import Header from "../components/Header";

export default function Cart() {
  // 🛒 Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);

  // 🧮 Calculate total dynamically
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const [couponCode, setCouponCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const applyCoupon = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/cart/apply-coupon", {
        couponCode,
        cartTotal,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Coupon failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // 💳 PAYMENT LOGIC
  const handlePayment = async () => {
    setPayLoading(true);
    try {
      const orderRes = await api.post("/orders", {
        cartItems,
        originalAmount: cartTotal,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
        couponCode,
      });

      const options = {
        key: orderRes.data.key,
        amount: orderRes.data.amount,
        currency: "INR",
        order_id: orderRes.data.orderId,
        name: "Smart Coupon Engine",
        description: "Order Payment",
        handler: async (response) => {
          await api.post("/orders/verify", response);
          alert("Payment Successful 🎉");
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <div className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        {/* 🔝 Header with Logout */}
        <Header />

        <h2 className="text-xl font-bold text-center">
          Shopping Cart
        </h2>

        {/* 🧾 Cart Items */}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400">
            Your cart is empty
          </p>
        ) : (
          <div className="space-y-2">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-gray-300"
              >
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* 💰 Cart Total */}
        <div className="flex justify-between font-semibold border-t border-gray-700 pt-3">
          <span>Total</span>
          <span>₹{cartTotal}</span>
        </div>

        {/* 🎟️ Coupon Input */}
        {cartItems.length > 0 && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              onClick={applyCoupon}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded font-semibold disabled:opacity-50"
            >
              {loading ? "Applying..." : "Apply Coupon"}
            </button>
          </div>
        )}

        {/* ❌ Error */}
        {error && (
          <div className="text-sm text-red-400 bg-red-900/30 p-3 rounded">
            {error}
          </div>
        )}

        {/* ✅ Discount Result */}
        {result && (
          <div className="space-y-2 border-t border-gray-700 pt-4">
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-400">
                − ₹{result.discountAmount}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Final Amount</span>
              <span>₹{result.finalAmount}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={payLoading}
              className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded font-semibold mt-4 disabled:opacity-50"
            >
              {payLoading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
