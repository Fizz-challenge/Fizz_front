import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './VideoDetail.css';
import Post from './DetailPost';
import CommentSection from './Comment';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import getVideoData from '../videosData';

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const loadVideoData = async () => {
      const videoData = await getVideoData(id - 1);
      if (videoData) {
        setVideo(videoData);
      }
    };
    loadVideoData();
  }, [id]);

  useEffect(() => {
    if (video) {
      const savedVideoId = localStorage.getItem('currentVideoId');
      const savedTime = localStorage.getItem('videoCurrentTime');
      const savedVolume = localStorage.getItem('videoVolume');


      console.log("SavedVideoId:", savedVideoId);
      console.log("CurrentId:", id);
      
      if (videoRef.current) {
        if (savedVideoId === id && savedTime) {
          console.log("어 맞다");
          videoRef.current.currentTime = savedTime;
          videoRef.current.play();
        }
        if (savedVolume) {
          videoRef.current.volume = parseFloat(savedVolume);
        }
        videoRef.current.addEventListener('volumechange', handleVolumeChange);
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('volumechange', handleVolumeChange);
      }
    };
  }, [video]);

  const handleVolumeChange = () => {
    if (videoRef.current) {
      localStorage.setItem('videoVolume', videoRef.current.volume);
    }
  };

  const handleBackClick = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      localStorage.setItem('videoCurrentTime', currentTime);
    }
    navigate('/');
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className='detail-background'>
      <div className='detail-video'>
        <div className="detail-video-section">
          <button className="back-button" onClick={handleBackClick}><MdArrowBack /></button>
          <video controls className="detail-video-player" autoPlay loop ref={videoRef} playsInline>
            <source src={video.src} type="video/mp4" />
          </video>
          <div className="scroll-buttons">
            <span className="scroll-button"><FaChevronUp /></span>
            <span className="scroll-button"><FaChevronDown /></span>
          </div>
        </div>
        <div className="content-section">
          <Post video={video} />
          <CommentSection comments={video.commentsData} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
