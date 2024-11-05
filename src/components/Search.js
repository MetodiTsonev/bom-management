import React, { useState } from "react";
import './Search.css';

const Search = ({ onSearch }) => {
    const [search, setSearch] = useState('');

    const handleChange = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <input
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Search..."
        />
    );
};

export default Search;