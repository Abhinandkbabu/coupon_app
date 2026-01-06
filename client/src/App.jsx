import { useSelector } from "react-redux";
import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Product";
import Cart from "./pages/Cart";

import "./App.css";

function App() {
  const token = useSelector((state) => state.auth.token);
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

  // 🛒 App Flow
  return page === "products" ? (
    <Products goToCart={() => setPage("cart")} />
  ) : (
    <Cart goBack={() => setPage("products")} />
  );
}

export default App;
