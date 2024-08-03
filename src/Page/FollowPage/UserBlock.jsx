import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './UserBlock.css';
import humanIcon from '../../assets/human.png';
import { FaUserAltSlash } from "react-icons/fa";
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
    // Perform unfollow action
    try {
      const response = await fetch(`https://gunwoo.store/api/user/following/${userId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        onFollowToggle(userId);
      } else {
        // Handle error
        console.error('Failed to unfollow');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const followButton = (
    <button
      className='followToggleButton'
      onClick={(e) => {
        e.stopPropagation();
        isFollowing ? openModal() : onFollowToggle(userId);
      }}
      style={{ backgroundColor: isFollowing ? '#ffffff' : '#007bff', color: isFollowing ? '#007bff' : '#ffffff' }}
    >
      {loading ? <AiOutlineLoading3Quarters className="loading-icon" /> : isFollowing ? '팔로잉' : '팔로우'}
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
