import React, { useState, useEffect, useRef } from 'react';
import './MainPage.css';
import Video from './Video';
import Buttons from './Buttons';
import getVideoData from '../videosData';

const MainPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const mainPageRef = useRef(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const loadInitialVideos = async () => {
      const firstVideo = await getVideoData(0);
      const secondVideo = await getVideoData(1);
      if (firstVideo) {
        setVideos(secondVideo ? [firstVideo, secondVideo] : [firstVideo]);
      } else {
      }
    };
    loadInitialVideos();
  }, []);

  useEffect(() => {
    const handleScroll = async (event) => {
      if (isScrollingRef.current) return;

      const mainPage = mainPageRef.current;
      if (!mainPage) return;

      isScrollingRef.current = true;

      const { deltaY } = event;
      if (deltaY > 0 && currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          if (newIndex + 1 === videos.length) {
            getVideoData(newIndex + 1).then((data) => {
              if (data) {
                setVideos((prevVideos) => [...prevVideos, data]);
              }
            });
          }
          return newIndex;
        });
      } else if (deltaY < 0 && currentVideoIndex > 0) {
        setCurrentVideoIndex((prevIndex) => prevIndex - 1);
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
  }, [currentVideoIndex, videos]);

  // useEffect(() => {
  //   const mainPage = mainPageRef.current;
  //   if (mainPage) {
  //     const currentVideo = document.getElementById(`video-${currentVideoIndex}`);
  //     if (currentVideo) {
  //       currentVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //     }
  //   }
  // }, [currentVideoIndex]);

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
                likes={video.likes}
                comments={video.comments}
                shares={video.shares}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainPage;
