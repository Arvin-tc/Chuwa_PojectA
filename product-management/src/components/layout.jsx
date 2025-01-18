import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, saveCart } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import Cart from "./cart";
import cartIcon from "../icon/shopping_cart.png"

export default function Layout({ children }) {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) =>
    user ? state.cart.items : JSON.parse(localStorage.getItem("guestCart")) || []
  );
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = async() => {
    if (user) {
      try {
        // Dispatch saveCart thunk
        await dispatch(saveCart({ userId: user.id, cartItems }));
          console.log(cartItems);
      } catch (error) {
        console.error("Failed to save cart:", error.message);
      }
    }
    dispatch(logout());
    dispatch(clearCart());
    navigate("/signin");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-white">Product</span>{" "}
            <span className="text-gray-300">Management</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            {/* Authentication */}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/signin"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Sign In
              </Link>
            )}

           {/* Cart */}
           <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center text-gray-200 hover:text-white"
              >
                <img src={cartIcon} alt="Cart" className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
            </div>


            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">{children}</main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">©2025 All Rights Reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <span  className="hover:underline" />
              YouTube
            <span className="hover:underline" />
              Twitter
            <span className="hover:underline" />
              Facebook
          </div>
        </div>
      </footer>

      {/* Cart Overlay */}
      {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
    </div>
  );
}
