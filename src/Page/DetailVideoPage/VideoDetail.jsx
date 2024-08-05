import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Hls from 'hls.js';
import Slider from 'react-slick';
import './VideoDetail.css';
import Post from './DetailPost';
import CommentSection from './Comment';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

const NextArrow = (props) => {
  const { onClick } = props;
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

const PrevArrow = (props) => {
  const { onClick } = props;
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
    sessionStorage.setItem('currentVideoId', id);
    loadVideoData();
  }, [id]);

  useEffect(() => {
    if (video && video.fileType === "VIDEO" && video.fileUrls) {
      const savedVideoId = sessionStorage.getItem('currentVideoId');
      const savedTime = sessionStorage.getItem('videoCurrentTime');
      const savedVolume = sessionStorage.getItem('videoVolume');

      if (videoRef.current) {
        const hls = new Hls();

        if (Hls.isSupported()) {
          hls.loadSource(video.fileUrls[0]);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (savedVideoId === id && savedTime) {
              videoRef.current.currentTime = savedTime;
            }
            if (savedVolume !== null && !isNaN(parseFloat(savedVolume))) {
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
            if (savedVolume !== null && !isNaN(parseFloat(savedVolume))) {
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
      sessionStorage.setItem('videoVolume', videoRef.current.volume);
    }
  };

  const handleBackClick = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      sessionStorage.setItem('videoCurrentTime', currentTime);
    }
    navigate(-1);
  };

  if (!video) return <div>Loading...</div>;

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
    <div className='detail-background'>
      <div className='detail-video'>
        <div className="detail-video-section">
          <button className="detail-back-button" onClick={handleBackClick}><MdArrowBack /></button>
          {video.fileType === "VIDEO" ? (
            <video controls className="detail-video-player" autoPlay loop ref={videoRef} playsInline>
              <source src={video.fileUrls[0]} type="application/vnd.apple.mpegurl" />
            </video>
          ) : (
            <Slider {...settings} className='new-image-slider'>
              {video.fileUrls.map((url, index) => (
                <div key={index} className="image-wrapper">
                  <img src={url} alt={`slide ${index}`} />
                </div>
              ))}
            </Slider>
          )}

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
