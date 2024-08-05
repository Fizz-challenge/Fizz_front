import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import './SearchBar.css';

const SearchBar = ({ className = '', onSearch, onFocus = () => {}, onBlur = () => {} }) => {
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleChange = (e) => {
    setTerm(e.target.value);
    setLoading(true);

    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    const newTimeoutId = setTimeout(() => {
      onSearch(e.target.value);
      setLoading(false);
    }, 500); // 0.5 seconds delay

    setTimeoutId(newTimeoutId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear the previous timeout and immediately search
    if (timeoutId) {
      clearTimeout(timeoutId);
      onSearch(term);
      setLoading(false);
    }
  };

  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
      <div className="search-icon"><FaSearch /></div>
      <input
        type="text"
        value={term}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="검색"
      />
      {loading && <AiOutlineLoading3Quarters className="loading-icon" />}
    </form>
  );
};

SearchBar.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default SearchBar;
