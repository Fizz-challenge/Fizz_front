import React, { useRef, useEffect, useState } from 'react';
import './VideoThumbnail.css';

const VideoThumbnail = ({ item }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (item.type === 'video') {
      const videoElement = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const handleLoadedData = () => {
        videoElement.currentTime = 0;
      };

      const handleSeeked = () => {
        const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
        const width = canvas.width;
        const height = width / aspectRatio;
        canvas.height = height;
        context.drawImage(videoElement, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png');
        setThumbnail(dataUrl);
      };

      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('seeked', handleSeeked);

      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('seeked', handleSeeked);
      };
    } else {
      setThumbnail(item.src);
    }
  }, [item.src, item.type]);

  return (
    <div className="video-thumbnail">
      {item.type === 'video' && (
        <>
          <video ref={videoRef} src={item.src} style={{ display: 'none' }} />
          <canvas ref={canvasRef} width="300" style={{ display: 'none' }} />
        </>
      )}
      {thumbnail ? (
        <div>
          <img src={thumbnail} alt={item.title} className="thumbnail" />
          <div className="overlay">
            <img src={item.userProfile} alt={`${item.user} profile`} className="user-profile" />
            <p className="video-views">Views: {item.views}</p>
          </div>
        </div>
      ) : (
        <div className="spinner">Loading...</div>
      )}
    </div>
  );
};

export default VideoThumbnail;
