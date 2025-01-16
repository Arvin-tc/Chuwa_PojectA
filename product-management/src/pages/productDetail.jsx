import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeDeletedItem } from "../redux/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


  const handleAddToCart = () => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existingItemIndex = guestCart.findIndex((item) => item.id === product._id);

      if (existingItemIndex >= 0) {
        guestCart[existingItemIndex].quantity += quantity;
      } else {
        guestCart.push({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.imageUrls[0],
          quantity,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      alert(`${quantity} ${product.name} added to cart as a guest.`);
    } else {
      dispatch(
        addItem({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.imageUrls[0],
          quantity,
        })
      );
      alert(`${quantity} ${product.name} added to your cart.`);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(prevQuantity + change, 1));
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      if (user) {
        dispatch(removeDeletedItem(product._id)); // Redux store for authenticated users
    } else {
        const guestCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const updatedCart = guestCart.filter((item) => item.id !== product._id);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }

      alert("Product deleted successfully");
      navigate("/"); // Navigate back to the product list
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <main className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product Details</h1>
          <button
            onClick={handleBackClick}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        </div>
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="flex justify-center">
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="w-full max-w-lg rounded-lg shadow-md object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-gray-500 font-medium">{product.category}</h4>
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              <h3 className="text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</h3>
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">In Stock</p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
              <p className="text-gray-600">{product.description}</p>

              {/* Cart Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
                

                {product.stock > 0 ? (<button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add To Cart
                </button>):<></>}
              </div>

              {/* Admin-only Edit & Delete Button */}
              {user?.userType === "admin" && (
                <div className="flex space-x-4">
                    {/* Edit Button */}
                    <Link to={`/products/${product._id}/edit`}>
                    <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                        Edit
                    </button>
                    </Link>

                    <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                    Delete
                    </button>
                </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
