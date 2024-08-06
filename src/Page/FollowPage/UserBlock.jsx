import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoticePopup from '../../Components/NoticePopup'; // NoticePopup 컴포넌트 import
import './UserBlock.css';
import { FaUserAltSlash, FaUserPlus } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const UserBlock = ({ userId, userProfileId, username, description, profileImage, isFollowing, onFollowToggle }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupStatus, setPopupStatus] = useState(["", ""]);
  
  const handleClick = () => {
    navigate(`/profile/${userProfileId}`);
  };

  const openPopup = () => {
    setPopupStatus(["정말 언팔로우 하시겠습니까?", "#ff3636"]);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const confirmUnfollow = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://gunwoo.store/api/user/following/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      if (response.ok) {
        onFollowToggle(userId, false);
      } else {
        const result = await response.json();
        console.error('Failed to unfollow:', result.message);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        closePopup();
      }, 300);
    }
  };

  const followRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://gunwoo.store/api/user/following/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          onFollowToggle(userId, true);
        } else {
          console.error('Failed to follow:', result.message);
        }
      } else {
        const result = await response.json();
        console.error('Failed to follow:', result.message);
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoading(false);
    }
  };

  const followButton = (
    <button
      className={`followToggleButton ${isFollowing ? 'following' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        isFollowing ? openPopup() : followRequest();
      }}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="loadingIcon" />
      ) : isFollowing ? (
        <FaUserAltSlash />
      ) : (
        <FaUserPlus />
      )}
    </button>
  );

  return (
    <div className='userBlock'>
      <div className='userInfoContainer' onClick={handleClick}>
        {profileImage ? (
          <img src={profileImage} alt="User Icon" className='userIcon' />
        ) : (
          <div className='userIcon skeletonIcon'></div>
        )}
        <div className='userInfo'>
          <div className='username'>{username}</div>
          <div className='description'>{description}</div>
        </div>
      </div>
      {followButton}
      {isPopupVisible && (
        <NoticePopup
          setIsPopupVisible={setIsPopupVisible}
          popupStatus={popupStatus}
          buttonStatus={{
            bgcolor: "#ff3636",
            color: "#ffffff",
            msg: "확인",
            action: confirmUnfollow,
          }}
          noButton={true}
        />
      )}
    </div>
  );
};

export default UserBlock;
