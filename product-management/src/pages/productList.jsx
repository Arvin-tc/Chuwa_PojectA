import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, selectProducts, selectLoading, selectError } from "../redux/productSlice";
import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import Pagination from "../components/pagination";
import Filter from "../components/filter";

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const user = useSelector((state) => state.auth.user);

  // Filter state
  const [filter, setFilter] = useState("lastAdded");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items to display per page
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const sortedProducts = [...products].sort((a, b) => {
    if (filter === "priceLowToHigh") {
      return a.price - b.price;
    } else if (filter === "priceHighToLow") {
      return b.price - a.price;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="container mx-auto px-6 py-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>

        {/* Filter */}
        <div className="flex justify-between items-center mb-4">
          <Filter currentFilter={filter} onFilterChange={handleFilterChange} />

        {/* Only adimin user see the button */}
          {user?.userType === "admin" && (<Link to="/products/create">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Add Product
            </button>
          </Link>)}
          
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default ProductList;
