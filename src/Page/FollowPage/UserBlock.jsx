import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserBlock.css';
import humanIcon from '../../assets/human.png';

const UserBlock = ({ userId, username, description, profileImage }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className='userBlock' onClick={handleClick}>
      <img src={profileImage || humanIcon} alt="User Icon" className='userIcon' />
      <div className='userInfo'>
        <div className='username'>{username}</div>
        <div className='description'>{description}</div>
      </div>
    </div>
  );
};

export default UserBlock;
