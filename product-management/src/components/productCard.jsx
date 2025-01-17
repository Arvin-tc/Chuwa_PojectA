import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";

const ProductCard = ({ product }) => {
    const user = useSelector((state) => state.auth.user); 
    const [quantity, setQuantity] = useState(1); 
    const dispatch = useDispatch();

    const handleQuantityChange = (change) => {
        setQuantity((prevQuantity) => Math.max(prevQuantity + change, 1));
    };
    
    const handleAddToCart = () => {
        if (!user) {
            const guestCart = JSON.parse(localStorage.getItem("guestcart")) || [];
            const existingItemIndex = guestCart.findIndex((item) => item._id === product._id);
            if (existingItemIndex >= 0) {
                guestCart[existingItemIndex].quantity += quantity;
            } else {
                guestCart.push({ id: product._id, name: product.name, price: product.price, image: product.imageUrls[0], quantity });
            }
            localStorage.setItem("guestCart", JSON.stringify(guestCart));
            alert(`Added ${quantity} ${product.name} to the cart!`);
        }else{
            dispatch(addItem({ id: product._id, name: product.name, price: product.price, image: product.imageUrls[0], quantity }));
            alert(`${quantity} ${product.name} added to your cart.`);
        }
    };

    return (
        <div className="border rounded-lg shadow-lg p-4 bg-white flex flex-col">
          {/* Product Image */}
          <Link to={`/products/${product._id}`}>
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
          </Link>
    
          {/* Product Name */}
          <Link to={`/products/${product._id}`}>
            <h2 className="text-lg font-semibold text-gray-800 mt-4 hover:underline">
              {product.name}
            </h2>
          </Link>
    
          {/* Product Price */}
          <h3 className="text-xl font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</h3>
    
          {/* Quantity and Add to Cart/Out of Stock */}
          <div className="flex items-center gap-2 mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center justify-between flex-1 bg-gray-100 py-1 px-2 rounded">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-lg font-semibold text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
    
            {/* Add to Cart/Out of Stock Button */}
            {product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center"
              >
                Add
              </button>
            ) : (
              <p className="flex-1 py-2 bg-red-500 text-white text-center rounded-lg">
                Out of Stock
              </p>
            )}
          </div>
    
          {/* Admin Edit Button */}
          {user?.userType === "admin" && (
            <Link to={`/products/${product._id}/edit`} className="mt-4">
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Edit
              </button>
            </Link>
          )}
        </div>
      );
};

export default ProductCard;
