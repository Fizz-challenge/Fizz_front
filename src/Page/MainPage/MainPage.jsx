import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';
import Video from './Video';
import Buttons from './Buttons';

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mainPageRef = useRef(null);
  const isScrollingRef = useRef(false);
  const isFetchingRef = useRef(false);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => {
    const savedIndex = sessionStorage.getItem('currentVideoIndex');
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadVideos = async (page) => {
    try {
      const response = await axios.get(`https://gunwoo.store/api/posts?page=${page}&size=20&sort=id,desc`);
      const fetchedVideos = response.data.data.content;
      console.log(`${page}와 ${fetchedVideos.length}`);
      setVideos(prevVideos => [...prevVideos, ...fetchedVideos]);
      const totalElements = response.data.data.page.totalElements;
      const totalPage = Math.ceil(totalElements / 20);
      setTotalPages(totalPage);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    loadVideos(page);
  }, [page]);

  useEffect(() => {
    if (location.state?.currentVideoIndex !== undefined) {
      setCurrentVideoIndex(location.state.currentVideoIndex);
    }
  }, [location.state]);

  useEffect(() => {
    const savedIndex = sessionStorage.getItem('currentVideoIndex');
    if (savedIndex !== null && parseInt(savedIndex, 10) !== currentVideoIndex) {
      setCurrentVideoIndex(parseInt(savedIndex, 10));
    } else if (videos.length > 0 && videos[currentVideoIndex]) {
      navigate(`/${videos[currentVideoIndex].id}`, { replace: true });
    }
  }, [currentVideoIndex, videos, navigate]);

  useEffect(() => {
    const handleScroll = (event) => {
      if (isScrollingRef.current || isFetchingRef.current) return;
      if (!mainPageRef.current) return;

      isScrollingRef.current = true;
      const { deltaY } = event;

      if (deltaY > 0) {
        setCurrentVideoIndex((prevIndex) => {
          let newIndex = prevIndex + 1;
          if (newIndex >= videos.length) {
            newIndex = 0;
          }
          sessionStorage.setItem('currentVideoIndex', newIndex);
          if (videos[newIndex]) {
            navigate(`/${videos[newIndex].id}`, { replace: true });
          }
          if (newIndex >= videos.length - 10 && page < totalPages) {
            setPage(prevPage => prevPage + 1);
          }
          return newIndex;
        });
      } else if (deltaY < 0 && currentVideoIndex > 0) {
        setCurrentVideoIndex((prevIndex) => {
          const newIndex = prevIndex - 1;
          sessionStorage.setItem('currentVideoIndex', newIndex);
          if (videos[newIndex]) {
            navigate(`/${videos[newIndex].id}`, { replace: true });
          }
          return newIndex;
        });
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    };

    const mainPage = mainPageRef.current;
    if (mainPage) {
      mainPage.addEventListener('wheel', handleScroll);
    }

    return () => {
      if (mainPage) {
        mainPage.removeEventListener('wheel', handleScroll);
      }
    };
  }, [currentVideoIndex, videos, page, totalPages, navigate]);

  const handleVideoClick = (index) => {
    if (mainPageRef.current) {
      const videoElement = mainPageRef.current.querySelector(`#video-${index} video`);
      if (videoElement) {
        const currentTime = videoElement.currentTime;
        sessionStorage.setItem('videoCurrentTime', currentTime);
      }
    }
    sessionStorage.setItem('currentVideoIndex', index);
    navigate(`/video/${videos[index].id}`, { state: { videos, currentVideoIndex: index } });
  };

  const handleVolumeChange = (event) => {
    const volume = parseFloat(event.target.value);
    if (!isNaN(volume)) {
      sessionStorage.setItem('videoVolume', volume);
    }
  };

  return (
    <div ref={mainPageRef} className="main-page">
      {videos.map((video, index) => (
        <div
          id={`video-${index}`}
          key={index}
          className={`video-wrapper ${index === currentVideoIndex ? 'active' : index < currentVideoIndex ? 'hidden' : ''}`}
        >
          <div className="video-buttons-wrapper">
            <div onClick={() => handleVideoClick(index)}>
              <Video video={video} isActive={index === currentVideoIndex} onVolumeChange={handleVolumeChange} fileType={video.fileType} />
            </div>
            <div className="buttons-container">
              <Buttons
                id={video.id}
                likes={video.likeCount}
                comments={video.commentCount}
                views={video.viewCount}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainPage;
