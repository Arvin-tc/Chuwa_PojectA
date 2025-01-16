import React from "react";
import "../styles/pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="pagination">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
