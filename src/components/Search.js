import React, { useState } from "react";
import './Search.css';

const Search = ({ value, onSearch }) => {
    const handleChange = (e) => {
      onSearch(e.target.value); // Pass the updated search value to the parent
    };

    return (
      <input
        type="text"
        value={value} // Controlled by the parent
        onChange={handleChange}
        placeholder="Search..."
      />
    );
  };

export default Search;