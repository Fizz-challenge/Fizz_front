import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './TopBar.css';

const TopBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="top-bar">
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색"
          />
          <button type="submit"><FaSearch /></button>
        </div>
      </form>
    </div>
  );
};

export default TopBar;
