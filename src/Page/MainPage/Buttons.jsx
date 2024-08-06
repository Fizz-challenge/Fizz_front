import React, { useState, useEffect } from 'react';
import './Buttons.css';
import { useNavigate } from 'react-router-dom';
import { FaComment, FaHeart, FaRegHeart } from 'react-icons/fa';
import { ImPlay2 } from "react-icons/im";
import axios from 'axios';
import NoticePopup from '../../Components/NoticePopup';

const Buttons = ({ id, likes, comments, views }) => {
  const [animate, setAnimate] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
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
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [id]);

  const handleCommentClick = (event) => {
    event.stopPropagation();
    navigate(`/video/${id}`);
  };

  const handleLikeClick = async (event) => {
    event.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }
    setAnimate(true);
    try {
      if (isLiked) {
        await axios.delete(`https://gunwoo.store/api/posts/${id}/likes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLikeCount(prevCount => prevCount - 1);
      } else {
        await axios.post(`https://gunwoo.store/api/posts/${id}/likes`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLikeCount(prevCount => prevCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like status:', error);
      setIsLiked(!isLiked);
    }

    setTimeout(() => setAnimate(false), 1000);
  };

  return (
    <>
    <div className="buttons-container">
      <div className={`button-item ${animate ? 'animate' : ''}`} onClick={handleLikeClick}>
        {isLiked ? <FaHeart className="svg-icon icon-fill" /> : <FaRegHeart className="svg-icon icon-fill" />}
        <div className="animation-container">
          <div className="fill"></div>
        </div>
      </div>
      <span>{likeCount}</span>
      <div className="button-item" onClick={handleCommentClick}>
        <FaComment />
      </div>
      <span>{comments}</span>
      <div className="button-item">
        <ImPlay2 />
      </div>
      <span>{views}</span>
      </div>
      {isPopupVisible && (
        <NoticePopup
          style={{zIndex:"1000"}}
          setIsPopupVisible={setIsPopupVisible}
          popupStatus={["로그인이 필요한 서비스입니다.", "#2DA7FF"]}
          buttonStatus={{ msg: "확인", action: () => navigate('/login') }}
        />
      )}
          </>
  );
};

export default Buttons;
