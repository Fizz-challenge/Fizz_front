import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [placeholderText, setPlaceholderText] = useState('검색');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder={placeholderText}
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button type="submit" className="search-button">
        <FaSearch className="search-icon" />
      </button>
    </form>
  );
};

export default SearchBar;
