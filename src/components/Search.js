import React from "react";
import './Search.css';

const Search = ({ search, setSearch }) => {
    return (
        <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        />
    );
};

export default Search;