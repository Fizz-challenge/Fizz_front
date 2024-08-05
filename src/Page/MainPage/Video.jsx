import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import Hls from "hls.js";
import Slider from 'react-slick';
import './Video.css';

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="image-arrow next-arrow"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <IoIosArrowForward />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="image-arrow prev-arrow"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <IoIosArrowBack />
    </div>
  );
};
const VideoSlider = ({ video, handleImageClick }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: video.fileUrls.length > 1,
    nextArrow: video.fileUrls.length > 1 ? <NextArrow /> : null,
    prevArrow: video.fileUrls.length > 1 ? <PrevArrow /> : null
  };

  return (
    <Slider {...settings} className='new-slider'>
      {video.fileUrls.map((url, index) => (
        <div key={index} className="image-wrapper" onClick={() => handleImageClick(video.id)}>
          <img src={url} alt={`slide ${index}`} />
        </div>
      ))}
    </Slider>
  );
};

const Video = ({ video, isActive, onVolumeChange, fileType }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const handleVideoClick = (id) => {
    const currentTime = videoRef.current ? videoRef.current.currentTime : 0;
    localStorage.setItem('videoCurrentTime', currentTime);
    navigate(`/video/${video.id}`);
  };

  const handleImageClick = (id) => {
    navigate(`/video/${video.id}`);
  };

  useEffect(() => {
    if (fileType === "VIDEO") {
      const loadVideo = () => {
        if (!videoRef.current || !video.fileUrls[0]) {
          return;
        }

        const hls = new Hls({
          maxBufferLength: 60,
          maxMaxBufferLength: 120,
          maxBufferSize: 1000 * 1000 * 1000, 
          maxBufferHole: 0.5,
          enableWorker: true,
          startPosition: -1,
        });

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
        const savedVolume = parseFloat(localStorage.getItem('videoVolume')) || 1;

        if (!isNaN(savedVolume) && videoRef.current) {
          videoRef.current.volume = savedVolume;
        }

        if (savedVideoId === String(video.id) && savedTime) {
          videoRef.current.currentTime = savedTime;
        } else {
          localStorage.setItem('videoCurrentTime', 0);
        }

        const handleTimeUpdate = () => {
          if (videoRef.current && !isNaN(videoRef.current.currentTime)) {
            setCurrentTime(videoRef.current.currentTime);
          }
        };

        const handleLoadedMetadata = () => {
          if (videoRef.current && !isNaN(videoRef.current.duration)) {
            setDuration(videoRef.current.duration);
          }
        };

        if (videoRef.current) {
          videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
          videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          }
        };
      };

      loadVideo();
    }
  }, [video.id, video.fileUrls, isActive, fileType]);

  useEffect(() => {
    if (fileType === "VIDEO" && videoRef.current && !isActive) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, fileType]);

  useEffect(() => {
    if (fileType === "VIDEO" && isActive && videoRef.current) {
      const savedVolume = sessionStorage.getItem('videoVolume');
      if (savedVolume !== null && !isNaN(parseFloat(savedVolume))) {
        videoRef.current.volume = parseFloat(savedVolume);
      }
    }
    setIsPlaying(isActive);
  }, [isActive, fileType]);

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
    if (!isNaN(newVolume) && videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    sessionStorage.setItem('videoVolume', newVolume);
    onVolumeChange(event); 
  };

  const handleTimeChange = (event) => {
    event.stopPropagation();
    const newTime = parseFloat(event.target.value);
    if (!isNaN(newTime) && videoRef.current) {
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

  const handleUserClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${video.userInfo.profileId}`);
  };

  const handleChallengeClick = (e) => {
    e.stopPropagation();
    navigate(`/challenge/${video.challengeInfo.title}`);
  };

  if (fileType === "VIDEO") {
    return (
      <div className='video-feed'>
        <div className="video-container">
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
              <span className="video-user-name" onClick={handleUserClick}>{video.userInfo.nickname}</span> · <span>조회수 {video.viewCount}회</span> · <span className="video-challenge-name" onClick={handleChallengeClick}>#{video.challengeInfo.title}</span>
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
                  value={videoRef.current ? videoRef.current.volume : 1}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (fileType === "IMAGE") {
    return (
      <div className='video-feed'>
        <div className="video-image-container">
          <VideoSlider video={video} handleImageClick={handleImageClick} />
          <div className="video-content-info">
            <div className="video-content-title">{video.title}</div>
            <div className="video-details">
              <span className="video-user-name" onClick={handleUserClick}>{video.userInfo.nickname}</span> · <span>조회수 {video.viewCount}회</span> · <span className="video-challenge-name" onClick={handleChallengeClick}>#{video.challengeInfo.title}</span>
              <p>{video.content}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Video;
