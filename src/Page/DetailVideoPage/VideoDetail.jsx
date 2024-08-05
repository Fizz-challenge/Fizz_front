import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Hls from 'hls.js';
import './VideoDetail.css';
import Post from './DetailPost';
import CommentSection from './Comment';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const loadVideoData = async () => {
      try {
        const response = await axios.get(`https://gunwoo.store/api/posts/${id}`);
        const videoData = response.data.data;
        setVideo(videoData);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };
    loadVideoData();
  }, [id]);

  useEffect(() => {
    if (video && video.fileUrls) {
      const savedVideoId = localStorage.getItem('currentVideoId');
      const savedTime = localStorage.getItem('videoCurrentTime');
      const savedVolume = localStorage.getItem('videoVolume');

      console.log("SavedVideoId:", savedVideoId);
      console.log("CurrentId:", id);

      if (videoRef.current) {
        const hls = new Hls();

        if (Hls.isSupported()) {
          hls.loadSource(video.fileUrls[0]);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (savedVideoId === id && savedTime) {
              console.log("어 맞다");
              videoRef.current.currentTime = savedTime;
            }
            if (savedVolume) {
              videoRef.current.volume = parseFloat(savedVolume);
            }
            videoRef.current.play().catch((error) => {
              console.error("Error playing video:", error);
            });
          });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = video.fileUrls[0];
          videoRef.current.addEventListener('loadedmetadata', () => {
            if (savedVideoId === id && savedTime) {
              videoRef.current.currentTime = savedTime;
            }
            if (savedVolume) {
              videoRef.current.volume = parseFloat(savedVolume);
            }
            videoRef.current.play().catch((error) => {
              console.error("Error playing video:", error);
            });
          });
        }

        videoRef.current.addEventListener('volumechange', handleVolumeChange);
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('volumechange', handleVolumeChange);
      }
    };
  }, [video, id]);

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
    navigate(-1);
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className='detail-background'>
      <div className='detail-video'>
        <div className="detail-video-section">
          <button className="back-button" onClick={handleBackClick}><MdArrowBack /></button>
          <video controls className="detail-video-player" autoPlay loop ref={videoRef} playsInline>
            <source src={video.fileUrls[0]} type="application/vnd.apple.mpegurl" />
          </video>
          <div className="scroll-buttons">
            <span className="scroll-button"><FaChevronUp /></span>
            <span className="scroll-button"><FaChevronDown /></span>
          </div>
        </div>
        <div className="content-section">
          <Post video={video} />
          <CommentSection postId={id} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
