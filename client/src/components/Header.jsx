import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

export default function Header() {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">Smart Coupon Engine</h1>
      <button
        onClick={() => dispatch(logout())}
        className="text-sm bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}
