import { useState, useEffect } from "react";
import api from "../services/api";
import Header from "../components/Header";

export default function AdminPage() {
  // today in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minCartAmount: 0,
    maxDiscountAmount: 0,
    globalUsageLimit: 1,
    perUserUsageLimit: 1,
    validFrom: today,
    validTo: "",
  });

  const createCoupon = async () => {
    try {
      if (!form.code) {
        alert("Coupon code is required");
        return;
      }

      if (!form.validTo) {
        alert("Please select an offer ending date");
        return;
      }

      await api.post("/coupons/create", form);
      alert("Coupon created successfully");

      // Reset form
      setForm({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minCartAmount: 0,
        maxDiscountAmount: 0,
        globalUsageLimit: 1,
        perUserUsageLimit: 1,
        validFrom: today,
        validTo: "",
      });

      fetchCoupons();
    } catch (err) {
      console.error(err);
      alert("Failed to create coupon");
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Header />

      <h2 className="text-xl font-bold mb-4">Admin – Coupon Management</h2>

      {/* Create Coupon */}
      <div className="bg-gray-800 p-4 rounded mb-6 space-y-3 max-w-md">
        {/* Coupon Code */}
        <input
          placeholder="Coupon Code"
          className="w-full p-2 bg-gray-700 rounded uppercase"
          value={form.code}
          onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value.toUpperCase(),
            })
          }
        />

        {/* Discount Value */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="Discount Value (%)"
          className="w-full p-2 bg-gray-700 rounded"
          value={form.discountValue}
          onChange={(e) => {
            const value = e.target.value;

            // allow only numbers
            if (/^\d*$/.test(value)) {
              setForm({
                ...form,
                discountValue: value === "" ? "" : Number(value),
              });
            }
          }}
        />

        {/* Valid From (auto today) */}
        <div>
          <label className="text-sm text-gray-400">Valid From</label>
          <input
            type="date"
            value={form.validFrom}
            readOnly
            className="w-full p-2 bg-gray-600 rounded opacity-70"
          />
        </div>

        {/* Valid To */}
        <div>
          <label className="text-sm text-gray-400">Offer Ending Date</label>
          <input
            type="date"
            value={form.validTo}
            min={today}
            className="w-full p-2 bg-gray-700 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                validTo: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={createCoupon}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
        >
          Create Coupon
        </button>
      </div>

      {/* Coupon List */}
      <div className="space-y-2 max-w-md">
        {coupons.map((c) => (
          <div
            key={c._id}
            className="bg-gray-800 p-3 rounded flex justify-between"
          >
            <span className="font-semibold">{c.code}</span>
            <span className="text-sm text-gray-400">Used: {c.usedCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
