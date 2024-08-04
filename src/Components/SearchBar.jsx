import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ className = '', onSearch, onFocus = () => {}, onBlur = () => {} }) => {
  const [term, setTerm] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  const handleChange = (e) => {
    setTerm(e.target.value);

    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    const newTimeoutId = setTimeout(() => {
      onSearch(e.target.value);
    }, 500); // 0.5 seconds delay

    setTimeoutId(newTimeoutId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear the previous timeout and immediately search
    if (timeoutId) {
      clearTimeout(timeoutId);
      onSearch(term);
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
