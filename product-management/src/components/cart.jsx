import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../redux/cartSlice";
import { selectUser } from "../redux/authSlice";

const Cart = ({ onClose }) => {
  const [guestCart, setGuestCart] = useState([]);

  const user = useSelector(selectUser);
  const cartItemsFromRedux = useSelector((state) => state.cart.items);
  const cartItems = user ? cartItemsFromRedux : guestCart;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.2; // Assuming 20% tax
  const [discount, setDiscount] = useState(0); // Discount applied only if the correct code is entered
  const total = subtotal + tax - discount;

  const dispatch = useDispatch();
  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    if (!user) {
      const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setGuestCart(cart);
    }
  }, [user]);

  const handleRemove = (id) => {
    if (user) {
      dispatch(removeItem(id));
    } else {
      const updatedCart = guestCart.filter((item) => item.id !== id);
      setGuestCart(updatedCart);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const handleQuantityChange = (id, amount) => {
    if (user) {
      dispatch(updateQuantity({ id, amount }));
    } else {
      const updatedCart = guestCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0);

      setGuestCart(updatedCart);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === "chuwa") {
      setDiscount(20); // Apply a $20 discount
      alert("Discount applied!");
    } else {
      setDiscount(0); // Reset the discount if the code is invalid
      alert("Invalid discount code.");
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full md:w-1/3 bg-white shadow-lg h-full z-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Cart ({cartItems.length})</h2>
        <button
          onClick={onClose}
          className="text-white hover:bg-indigo-700 rounded-full p-2"
        >
          ✕
        </button>
      </div>

      {/* Cart Items */}
      <div className="px-6 py-4 overflow-y-auto flex-grow">
        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="flex-grow">
                <h3 className="text-gray-800 font-medium">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-gray-800">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* Discount and Summary */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Apply Discount Code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleApplyDiscount}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-800">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="text-gray-800">-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="px-6 py-4 bg-gray-100">
        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
          Continue to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
