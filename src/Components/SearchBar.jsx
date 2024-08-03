import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [placeholderText, setPlaceholderText] = useState('검색');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      setPlaceholderText('검색어를 입력해주세요');
    } else {
      onSearch(searchTerm);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '') {
      setPlaceholderText('검색어를 입력해주세요');
    } else {
      setPlaceholderText('검색');
    }
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
