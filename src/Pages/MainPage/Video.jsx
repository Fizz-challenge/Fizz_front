import React from 'react';
import './Video.css';

const Video = ({ video }) => {
  return (
    <div className='video-feed'>
    <div className="video-container">
      <video controls className="video">
        <source src={video.src} type="video/mp4" />
      </video>
      <div className="video-info">
        <div className="video-title">{video.title}</div>
        <div className="video-details">
            <span>{video.user}</span> · <span>조회수 {video.views}회</span>
            <p>내용</p>
        </div>
      </div>
      </div>
      </div>
  );
};

export default Video;
