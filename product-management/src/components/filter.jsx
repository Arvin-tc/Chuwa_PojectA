import React from "react";
import "../styles/filter.css";

const Filter = ({ currentFilter, onFilterChange }) => {
    return (
        <div className="filter-container">
            <select value={currentFilter} onChange={(e) => onFilterChange(e.target.value)}>
                <option value="lastAdded">Last added</option>
                <option value="priceLowToHigh">Price: low to high</option>
                <option value="priceHighToLow">Price: high to low</option>
            </select>
        </div>
    );
};

export default Filter;
