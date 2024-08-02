import React, { useState, useEffect } from 'react';
import './SearchPage.css';
import SearchBar from '../../Components/SearchBar'; // Import the SearchBar component
import categoryData from './Category.json'; // Import the local JSON file
import CategoryThumbnail from './CategoryThumbnail'; // Import the CategoryThumbnail component

const SearchPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState('popularity'); // 'popularity' or 'recency'
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load categories from local JSON file
    setCategories(categoryData.data);
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(
        videos.filter(video =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleSortByPopularity = () => {
    setSortMethod('popularity');
    setFilteredVideos(prevVideos =>
      [...prevVideos].sort((a, b) => b.likes - a.likes)
    );
  };

  const handleSortByRecency = () => {
    setSortMethod('recency');
    setFilteredVideos(prevVideos =>
      [...prevVideos].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
    );
  };

  return (
    <div className="search-page-container">
      <div className="search-page-main-content">
        <SearchBar className="search-page-search-bar" onSearch={handleSearch} /> {/* Use the SearchBar component */}
        <div className="category-bar">
        </div>
        {/* Category thumbnails rendering */}
        <div className="categories-grid">
          {categories.map((category, index) => (
            <CategoryThumbnail key={index} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
