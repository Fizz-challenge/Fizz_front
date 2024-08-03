import React, { useEffect, useState } from 'react';
import './DetailPost.css';
import { FaInstagram, FaFacebook, FaTwitter, FaLink, FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';

const DetailPost = ({ video }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likeCount);

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBQ0NFU1NfVE9LRU4iLCJ1c2VySWQiOiIyNCIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjI2MjI3NDQsImV4cCI6MTcyMjYyNDU0NH0.KD1IgCvMFcNOQqAIHtrfYsBk-4l8bTqMG2nX1LHOz2GYb7TJAHo-gQRgsrQ-FOmy60Ri7_rPNif3huC9y-5OgA';

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await axios.get(`https://gunwoo.store/api/posts/${video.id}/likes/check`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Like status response:', response.data);
        setIsLiked(response.data.data.isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    checkIfLiked();
  }, [video.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  };

  const handleSNSLinkClick = (url) => {
    window.open(url, '_blank');
  };

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        const response = await axios.delete(`https://gunwoo.store/api/posts/${video.id}/likes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Unlike response:', response.data);
        setLikeCount(prevCount => prevCount - 1); // 좋아요 취소 시 1 감소
      } else {
        const response = await axios.post(`https://gunwoo.store/api/posts/${video.id}/likes`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Like response:', response.data);
        setLikeCount(prevCount => prevCount + 1); // 좋아요 시 1 증가
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <>
      <div className="post-section">
        <div className="post-header">
          <img src={video.userInfo.profileImage} alt={`${video.userInfo.nickname} 프로필`} className="profile-img" />
          <div className="user-info">
            <h3>{video.userInfo.nickname}</h3>
            <p>조회수 {video.viewCount}</p>
          </div>
        </div>
        <div className='post-section-content'>
          <h2>{video.title}</h2>
          <p>{video.content}</p>
          <h3>#{video.challengeInfo.title}</h3>
          <span onClick={handleLikeClick} className="like-button">
            {isLiked ? <FaHeart /> : <FaRegHeart />} <span className='like-button-count'>{likeCount}</span>
          </span>
        </div>
      </div>
      <div className="link-section">
        <div className="file-link">
          <span>{window.location.href}</span>
          <button onClick={handleCopyLink} className="copy-link-button">
            <FaLink /> 링크 복사
          </button>
        </div>
        <div className="sns-link">
          <FaInstagram title="인스타그램" onClick={() => handleSNSLinkClick('https://www.instagram.com')} />
          <FaFacebook title="페이스북"onClick={() => handleSNSLinkClick('https://www.facebook.com')} />
          <FaTwitter title="트위터" onClick={() => handleSNSLinkClick('https://www.twitter.com')} />
        </div>
      </div>
    </>
  );
};

export default DetailPost;
