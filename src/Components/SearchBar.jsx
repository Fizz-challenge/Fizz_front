import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ className = '', onSearch, onFocus = () => {}, onBlur = () => {} }) => {
  const [term, setTerm] = useState('');

  const handleChange = (e) => {
    setTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };

  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
      <input
        type="text"
        value={term}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="검색어를 입력하세요..."
      />
      <button type="submit">검색</button>
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
