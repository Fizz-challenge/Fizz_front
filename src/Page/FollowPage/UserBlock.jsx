import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './UserBlock.css';
import humanIcon from '../../assets/human.png';
import { FaUserAltSlash, FaUserPlus } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const UserBlock = ({ userId, userProfileId, username, description, profileImage, isFollowing, onFollowToggle }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    navigate(`/profile/${userProfileId}`);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
      setLoading(false);
      closeModal();
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
        isFollowing ? openModal() : followRequest();
      }}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="loading-icon" />
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Unfollow Confirmation"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>정말 취소하시겠습니까?</h2>
        <div className="modal-buttons">
          <button onClick={confirmUnfollow} className="confirm-button">네</button>
          <button onClick={closeModal} className="cancel-button">아니오</button>
        </div>
      </Modal>
    </div>
  );
};

export default UserBlock;
