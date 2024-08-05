import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import './SearchBar.css';

const SearchBar = ({ className = '', onSearch, onFocus = () => {}, onBlur = () => {} }) => {
  const [term, setTerm] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleChange = (e) => {
    setTerm(e.target.value);
    setLoading(true); // 로딩 상태 시작

    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    const newTimeoutId = setTimeout(() => {
      onSearch(e.target.value);
      setLoading(false); // 로딩 상태 종료
    }, 500); // 0.5 seconds delay

    setTimeoutId(newTimeoutId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear the previous timeout and immediately search
    if (timeoutId) {
      clearTimeout(timeoutId);
      onSearch(term);
      setLoading(false); // 로딩 상태 종료
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
      {loading && <AiOutlineLoading3Quarters className="loading-icon" />} {/* 로딩 아이콘 추가 */}
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
