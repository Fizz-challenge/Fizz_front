import React from 'react';
import './VideoThumbnail.css';

const ImageThumbnail = ({ image }) => {
  return (
    <div className="video-thumbnail">
      <img src={image.src} alt={image.title} className="thumbnail image" />
      <div className="overlay">
        <img src={image.userProfile} alt={`${image.user} profile`} className="user-profile" />
        <p className="video-views">Views: {image.views}</p>
      </div>
    </div>
  );
};

export default ImageThumbnail;
