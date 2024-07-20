import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './Video.css';

const Video = ({ video, isActive }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const handleVideoClick = (id) => {
    const currentTime = videoRef.current.currentTime;
    localStorage.setItem('videoCurrentTime', currentTime);
    navigate(`/video/${video.id}`);
  };

  useEffect(() => {
    const savedVideoId = localStorage.getItem('currentVideoId');
    const savedTime = localStorage.getItem('videoCurrentTime');
    const savedVolume = parseFloat(localStorage.getItem('videoVolume')) || 0.5;

    if (videoRef.current) {
      videoRef.current.volume = savedVolume;
      console.log(`로컬 ${savedVideoId}`);
      console.log(`지금 ${video.id}`);
      if (savedVideoId === String(video.id) && savedTime) {
        videoRef.current.currentTime = savedTime;
        console.log("어 맞다");
      } else {
        localStorage.setItem('videoCurrentTime', 0);
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoRef.current.duration);
    };

    const videoElement = videoRef.current;
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [video.id]);

  useEffect(() => {
    if (isActive) {
      const savedVolume = parseFloat(localStorage.getItem('videoVolume'))
      videoRef.current.volume = savedVolume;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      localStorage.setItem('currentVideoId', video.id);
      console.log("저장", video.id)
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlayPause = (event) => {
    event.stopPropagation();
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    event.stopPropagation();
    const newVolume = parseFloat(event.target.value);
    videoRef.current.volume = newVolume;
    localStorage.setItem('videoVolume', newVolume);
  };

  const handleTimeChange = (event) => {
    event.stopPropagation();
    const newTime = parseFloat(event.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleVolumeControl = (event) => {
    event.stopPropagation();
    setShowVolumeControl(!showVolumeControl);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='video-feed'>
      <div className="video-container">
        <video className="video" loop ref={videoRef} playsInline onClick={() => handleVideoClick(video.id)}>
          <source src={video.src} type="video/mp4" />
        </video>
        <div className="video-info">
          <div className="video-title">{video.title}</div>
          <div className="video-details">
            <span>{video.user}</span> · <span>조회수 {video.views}회</span>
            <p>내용</p>
          </div>
        </div>
        <div className="custom-controls" onClick={(event) => event.stopPropagation()}>
          <button onClick={togglePlayPause}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleTimeChange}
          />
          <div className="time-info">
            <span>{formatTime(currentTime)}{" "}</span> / <span>{formatTime(duration)}</span>
          </div>
          <div className="volume-control">
            <button onClick={toggleVolumeControl}>
              {videoRef.current && videoRef.current.volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
            {showVolumeControl && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={videoRef.current ? videoRef.current.volume : 0.5}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
