import React, { useState, useEffect } from 'react';
import './SearchPage.css';
import VideoThumbnail from './VideoThumbnail';
import getVideoData from '../videosData/videosData';

const SearchPage = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialVideos = async () => {
      const videoData = await Promise.all([
        getVideoData(0),
        getVideoData(1),
        getVideoData(2),
        getVideoData(3),
        getVideoData(4),
      ]);
      setVideos(videoData.filter(video => video));
      setFilteredVideos(videoData.filter(video => video));
      setLoading(false);
    };
    loadInitialVideos();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(
        videos.filter(video =>
          video.title.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="container">
      <div className="mainContent">
        <div className="searchBar">
          <input
            type="text"
            placeholder="검색"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="categoryBar">
          <button>전체</button>
          <button>헬스</button>
          <button>음악</button>
          <button>독서</button>
          <button>금욕</button>
          <button>스포츠</button>
        </div>
        {loading ? (
          <div className="spinner">Loading videos...</div>
        ) : (
          <div className="videoList">
            {filteredVideos.map((video, index) => (
              <div key={index} className="videoItem">
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
