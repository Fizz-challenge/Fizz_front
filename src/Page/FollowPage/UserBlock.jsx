import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './UserBlock.css';
import humanIcon from '../../assets/human.png';
import { FaUserAltSlash, FaUserPlus } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const UserBlock = ({ userId, username, description, profileImage, isFollowing, onFollowToggle, viewType }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    navigate(`/profile/${userId}`);
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
      const result = await response.json();
      if (result.success) {
        onFollowToggle(userId);
      } else {
        console.error('Failed to unfollow');
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
        }
      });
      const result = await response.json();
      if (result.success) {
        onFollowToggle(userId);
      } else {
        console.error('Failed to follow');
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
        <img src={profileImage || humanIcon} alt="User Icon" className='userIcon' />
        <div className='userInfo'>
          <div className='username'>{username}</div>
          <div className='description'>{description}</div>
        </div>
      </div>
      {viewType === 'following' ? (
        <button className='followToggleButton' onClick={(e) => { e.stopPropagation(); openModal(); }}>
          <FaUserAltSlash />
        </button>
      ) : followButton}
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
