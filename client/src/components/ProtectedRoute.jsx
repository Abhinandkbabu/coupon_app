import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Please login first</p>
      </div>
    );
  }

  return children;
}
