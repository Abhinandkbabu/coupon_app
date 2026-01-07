import { useState, useEffect } from "react";
import api from "../services/api";
import Header from "../components/Header";

export default function AdminPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minCartAmount: 0,
    maxDiscountAmount: 0,
    globalUsageLimit: 1,
    perUserUsageLimit: 1,
    validFrom: "",
    validTo: "",
  });

  const createCoupon = async () => {
    const res = await api.post("/coupons/create", form);
    console.log(res)
    alert("Coupon created");
    fetchCoupons();
  };

  const fetchCoupons = async () => {
    const res = await api.get("/coupons");
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Header />

      <h2 className="text-xl font-bold mb-4">Admin – Coupon Management</h2>

      {/* Create Coupon */}
      <div className="bg-gray-800 p-4 rounded mb-6 space-y-2">
        <input
          placeholder="Coupon Code"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Discount Value"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              discountValue: +e.target.value,
            })
          }
        />

        <button
          onClick={createCoupon}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Create Coupon
        </button>
      </div>

      {/* Coupon List */}
      <div className="space-y-2">
        {coupons.map((c) => (
          <div
            key={c._id}
            className="bg-gray-800 p-3 rounded flex justify-between"
          >
            <span>{c.code}</span>
            <span>Used: {c.usedCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
