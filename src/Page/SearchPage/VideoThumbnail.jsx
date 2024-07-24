import React, { useRef, useEffect, useState } from 'react';

const VideoThumbnail = ({ video }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
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
  }, [video.src]);

  return (
    <div className="videoThumbnail">
      <video ref={videoRef} src={video.src} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="300" style={{ display: 'none' }} />
      {thumbnail ? (
        <div>
          <img src={thumbnail} alt="Video Thumbnail" />
          <h2>{video.title}</h2>
          <p>By: {video.user}</p>
          <img src={video.userProfile} alt={`${video.user} profile`} />
          <p>{video.description}</p>
          <p>Views: {video.views}</p>
        </div>
      ) : (
        <div className="spinner">Loading...</div>
      )}
    </div>
  );
};

export default VideoThumbnail;
