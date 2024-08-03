import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';
import Video from './Video';
import Buttons from './Buttons';

const MainPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const mainPageRef = useRef(null);
  const isScrollingRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialVideos = async () => {
      try {
        const response = await axios.get('https://gunwoo.store/api/posts?page=0&size=10');
        const fetchedVideos = response.data.data.content;
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    loadInitialVideos();
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      if (currentVideoIndex === 0) {
        navigate('/');
      } else {
        navigate(`/${videos[currentVideoIndex].id}`);
      }
    }
  }, [currentVideoIndex, videos, navigate]);

  useEffect(() => {
    const handleScroll = (event) => {
      if (isScrollingRef.current) return;

      const mainPage = mainPageRef.current;
      if (!mainPage) return;

      isScrollingRef.current = true;

      const { deltaY } = event;
      if (deltaY > 0 && currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          if (newIndex === 0) {
            navigate('/');
          } else {
            navigate(`/${videos[newIndex].id}`);
          }
          return newIndex;
        });
      } else if (deltaY < 0 && currentVideoIndex > 0) {
        setCurrentVideoIndex((prevIndex) => {
          const newIndex = prevIndex - 1;
          if (newIndex === 0) {
            navigate('/');
          } else {
            navigate(`/${videos[newIndex].id}`);
          }
          return newIndex;
        });
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 400);
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
  }, [currentVideoIndex, videos, navigate]);

  return (
    <div ref={mainPageRef} className="main-page">
      {videos.map((video, index) => (
        <div
          id={`video-${index}`}
          key={index}
          className={`video-wrapper ${index === currentVideoIndex ? 'active' : index < currentVideoIndex ? 'hidden' : ''}`}
        >
          <div className="video-buttons-wrapper">
            <Video video={video} isActive={index === currentVideoIndex} />
            <div className="buttons-container">
              <Buttons
                id={video.id}
                likes={video.likeCount}
                comments={video.commentCount}
                shares={video.viewCount}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainPage;
