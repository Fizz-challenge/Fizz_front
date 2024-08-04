import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LikeButton.css'; // 좋아요 버튼에 대한 CSS 파일 (필요시)

const LikeButton = ({ videoId, initialIsLiked }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [animate, setAnimate] = useState(false);

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBQ0NFU1NfVE9LRU4iLCJ1c2VySWQiOiIyMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjI1OTE2MTEsImV4cCI6MTcyMjU5MzQxMX0.c8ZZmZFstyRNE53uyJE4gNj_f73g6aU87OlpN8M_70xued5i0Ize45C2L_XrdLG3sI4MXAMyizaZQQV6tcxy8g';

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await axios.get(`https://gunwoo.store/api/posts/${videoId}/likes/check`, {
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
  }, [videoId]);

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        const response = await axios.delete(`https://gunwoo.store/api/posts/${videoId}/likes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Unlike response:', response.data);
      } else {
        const response = await axios.post(`https://gunwoo.store/api/posts/${videoId}/likes`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Like response:', response.data);
      }
      setIsLiked(!isLiked);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <button onClick={handleLikeClick} className={`like-button ${animate ? 'animate' : ''}`}>
      <svg viewBox="0 0 24 24" className={`like-icon ${isLiked ? 'liked' : ''}`}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
};

export default LikeButton;
