import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './UserBlock.css';
import humanIcon from '../../assets/human.png';

const UserBlock = ({ userId, username, description, profileImage, onFollowToggle }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    navigate(`/profile/${userId}`);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const confirmUnfollow = () => {
    onFollowToggle();
    closeModal();
  };

  return (
    <div className='userBlock'>
      <div className='userInfoContainer' onClick={handleClick}>
        <img src={profileImage || humanIcon} alt="User Icon" className='userIcon' />
        <div className='userInfo'>
          <div className='username'>{username}</div>
          <div className='description'>{description}</div>
        </div>
      </div>
      <button className='followToggleButton' onClick={(e) => { e.stopPropagation(); openModal(); }}>
        팔로우 취소
      </button>
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
