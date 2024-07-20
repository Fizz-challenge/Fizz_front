import React from 'react';
import './DetailPost.css';

const DetailPost = ({ video }) => {
  return (
    <div className="post-section">
      <div className="post-header">
        <img src={video.userProfile} alt={`${video.user} 프로필`} className="profile-img" />
        <div className="user-info">
          <h3>{video.user}</h3>
          <p>{video.views} 조회수</p>
        </div>
      </div>
      <h2>{video.title}</h2>
      <p>{video.description}</p>
    </div>
  );
};

export default DetailPost;
