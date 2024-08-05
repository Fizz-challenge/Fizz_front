import React, { useState, useEffect } from 'react';
import './Buttons.css';
import { useNavigate } from 'react-router-dom';
import { FaComment, FaHeart, FaRegHeart } from 'react-icons/fa';
import { ImPlay2 } from "react-icons/im";
import axios from 'axios';

const Buttons = ({ id, likes, comments, views }) => {
  const [animate, setAnimate] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes); // likes 상태 추가
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`https://gunwoo.store/api/posts/${id}/likes/check`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setIsLiked(response.data.data.isLiked);
          console.log(response.data);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [id]);

  const handleCommentClick = (event) => {
    event.stopPropagation(); // 부모 요소 클릭 접근 제한
    navigate(`/video/${id}`);
  };

  const handleLikeClick = async (event) => {
    event.stopPropagation();
    setAnimate(true);

    try {
      if (isLiked) {
        await axios.delete(`https://gunwoo.store/api/posts/${id}/likes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("123");
        setLikeCount(prevCount => prevCount - 1); // 좋아요 취소 시 likes 감소
      } else {
        await axios.post(`https://gunwoo.store/api/posts/${id}/likes`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLikeCount(prevCount => prevCount + 1); // 좋아요 추가 시 likes 증가
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like status:', error);
      // 요청 실패 시 상태 복원
      setIsLiked(!isLiked);
    }

    setTimeout(() => setAnimate(false), 1000);
  };

  return (
    <div className="buttons-container">
      <div className={`button-item ${animate ? 'animate' : ''}`} onClick={handleLikeClick}>
        {isLiked ? <FaHeart className="svg-icon icon-fill" /> : <FaRegHeart className="svg-icon icon-fill" />}
        <div className="animation-container">
          <div className="fill"></div>
        </div>
      </div>
      <span>{likeCount}</span> {/* 업데이트된 likes 상태 사용 */}
      <div className="button-item" onClick={handleCommentClick}>
        <FaComment />
      </div>
      <span>{comments}</span>
      <div className="button-item">
        <ImPlay2 />
      </div>
      <span>{views}</span>
    </div>
  );
};

export default Buttons;
