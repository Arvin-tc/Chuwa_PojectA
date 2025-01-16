import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct, fetchProductById } from "../redux/productSlice";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = ({isEditing}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        imageUrls: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const product = useSelector((state) => state.products.products.find((product) => product._id === id));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (formData.price <= 0) {
            alert("Price must be greater than 0");
            return;
        }
        if (formData.stock < 0) {
            alert("Stock cannot be negative");
            return;
        }
        if (!/^(https?:\/\/)[^\s/$.?#].[^\s]*$/.test(formData.imageUrls)) {
            alert("Please enter a valid URL for the image");
            return;
        }
    
        // Prepare product data
        const productData = {
            ...formData,
            imageUrls: [formData.imageUrls.trim()], // Wrap the single URL in an array
        };
    
        console.log("Product Data:", productData); // Debug log

        if (isEditing){
            await dispatch(updateProduct({ id, data: productData }));
        }
        else {
            await dispatch(createProduct(productData));
        }
        navigate("/products");
    };

    useEffect(() => {
        if (isEditing && product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                stock: product.stock || "",
                category: product.category || "",
                imageUrls: product.imageUrls?.join(", ") || "",
            });
        }
    }, [isEditing, product]);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isEditing ? "Edit Product" : "Create Product"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  placeholder="Product Name"
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
    
              {/* Product Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Product Description</label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  placeholder="Product Description"
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
    
              {/* Category and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Category1">Category1</option>
                    <option value="Category2">Category2</option>
                    <option value="Category3">Category3</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    placeholder="Price"
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
    
              {/* Stock and Image URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">In Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    value={formData.stock}
                    placeholder="Stock"
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="imageUrls" className="block text-sm font-medium text-gray-700">Add Image Link</label>
                  <input
                    type="text"
                    name="imageUrls"
                    id="imageUrls"
                    value={formData.imageUrls}
                    placeholder="Image URLs (comma-separated)"
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
    
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none"
              >
                {isEditing ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      );
};

export default ProductForm;