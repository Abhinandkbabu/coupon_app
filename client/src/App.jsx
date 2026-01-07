import { useSelector } from "react-redux";
import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Product";
import Cart from "./pages/Cart";
import AdminPage from "./pages/AdminPage";

import "./App.css";

function App() {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [page, setPage] = useState("products");
  const [showSignup, setShowSignup] = useState(false);

  // 🔐 Auth Gate
  if (!token) {
    return showSignup ? (
      <Signup switchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login switchToSignup={() => setShowSignup(true)} />
    );
  }

  // 🛡️ ADMIN FLOW
  if (role === "admin") {
    return <AdminPage />;
  }

  // 🛒 USER FLOW
  return page === "products" ? (
    <Products goToCart={() => setPage("cart")} />
  ) : (
    <Cart goBack={() => setPage("products")} />
  );
}

export default App;
