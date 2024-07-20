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
    const currentTime = videoRef.current ? videoRef.current.currentTime : 0;
    localStorage.setItem('videoCurrentTime', currentTime);
    navigate(`/video/${video.id}`);
  };

  useEffect(() => {
    const attemptSetVideoState = () => {
      if (!videoRef.current) {
        setTimeout(attemptSetVideoState, 200); // 200ms 후에 다시 시도
        return;
      }

      const savedVideoId = localStorage.getItem('currentVideoId');
      const savedTime = localStorage.getItem('videoCurrentTime');
      const savedVolume = parseFloat(localStorage.getItem('videoVolume')) || 0.5;

      videoRef.current.volume = savedVolume;
      if (savedVideoId === String(video.id) && savedTime) {
        videoRef.current.currentTime = savedTime;
      } else {
        localStorage.setItem('videoCurrentTime', 0);
      }

      const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
      };

      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    };

    attemptSetVideoState();
  }, [video.id]);

  useEffect(() => {
    const attemptPlayVideo = () => {
      if (!videoRef.current) {
        setTimeout(attemptPlayVideo, 200); // 200ms 후에 다시 시도
        return;
      }

      const savedVolume = parseFloat(localStorage.getItem('videoVolume')) || 0.5;
      videoRef.current.volume = savedVolume;

      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          localStorage.setItem('currentVideoId', video.id);
        }).catch(error => {
          console.error("Error playing video:", error);
        });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    attemptPlayVideo();
  }, [isActive, video.id]);

  const togglePlayPause = (event) => {
    event.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event) => {
    event.stopPropagation();
    const newVolume = parseFloat(event.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    localStorage.setItem('videoVolume', newVolume);
  };

  const handleTimeChange = (event) => {
    event.stopPropagation();
    const newTime = parseFloat(event.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
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
        <video
          className="video"
          loop
          ref={videoRef}
          playsInline
          onClick={() => handleVideoClick(video.id)}
        >
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
