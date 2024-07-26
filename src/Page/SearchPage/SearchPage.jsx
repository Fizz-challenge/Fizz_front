import React, { useState, useEffect } from 'react';
import './SearchPage.css';
import VideoThumbnail from './VideoThumbnail';
import getVideoData from '../videosData/videosData2';
import SearchBar from '../../Components/SearchBar'; // Import the SearchBar component

const SearchPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState('popularity'); // 'popularity' or 'recency'

  useEffect(() => {
    const loadInitialVideos = async () => {
      const videoData = [];
      let index = 0;
      let video = await getVideoData(index);

      while (video) {
        videoData.push(video);
        index++;
        video = await getVideoData(index);
      }

      setVideos(videoData);
      setFilteredVideos(videoData);
      setLoading(false);
    };

    loadInitialVideos();
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
    <div className="container">
      <div className="main-content">
        <SearchBar onSearch={handleSearch} /> {/* Use the SearchBar component */}
        <div className="category-bar">
          <button>전체</button>
          <button>헬스</button>
          <button>음악</button>
          <button>독서</button>
          <button>금욕</button>
          <button>스포츠</button>
        </div>
        <div className="sort-bar">
          <button
            className={sortMethod === 'popularity' ? 'active' : ''}
            onClick={handleSortByPopularity}
          >
            인기순
          </button>
          <button
            className={sortMethod === 'recency' ? 'active' : ''}
            onClick={handleSortByRecency}
          >
            최신순
          </button>
        </div>
        {loading ? (
          <div className="spinner">Loading videos...</div>
        ) : (
          <div className="video-list">
            {filteredVideos.map((video, index) => (
              <div key={index} className="video-item">
                <VideoThumbnail video={video} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
