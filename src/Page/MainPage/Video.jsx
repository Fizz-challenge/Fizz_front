import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Hls from 'hls.js';
import './Video.css';

const Video = ({ video, isActive }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isVertical, setIsVertical] = useState(false);

  const handleVideoClick = (id) => {
    const currentTime = videoRef.current ? videoRef.current.currentTime : 0;
    localStorage.setItem('videoCurrentTime', currentTime);
    navigate(`/video/${video.id}`);
  };

  useEffect(() => {
    const loadVideo = () => {
      if (!videoRef.current || !video.fileUrls[0]) {
        return;
      }

      const hls = new Hls();

      if (Hls.isSupported()) {
        hls.loadSource(video.fileUrls[0]);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isActive) {
            videoRef.current.play().catch((error) => {
              console.error("Error playing video:", error);
            });
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = video.fileUrls[0];
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (isActive) {
            videoRef.current.play().catch((error) => {
              console.error("Error playing video:", error);
            });
          }
        });
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
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        setIsVertical(videoHeight > videoWidth);
      };

      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    };

    loadVideo();
  }, [video.id, video.fileUrls, isActive]);

  useEffect(() => {
    if (videoRef.current && !isActive) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

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
      <div className={`video-container ${isVertical ? 'vertical' : 'horizontal'}`}>
        <video
          className="video"
          loop
          ref={videoRef}
          playsInline
          onClick={() => handleVideoClick(video.id)}
        />
        <div className="video-content-info">
          <div className="video-content-title">{video.title}</div>
          <div className="video-details">
            <span>{video.userInfo.nickname}</span> · <span>조회수 {video.viewCount}회</span>
            <p>{video.content}</p>
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
