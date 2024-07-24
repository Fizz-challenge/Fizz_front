import React from 'react';
import './UserBlock.css';
import humanIcon from '../../assets/human.png';

const UserBlock = ({ username, description }) => {
  return (
    <div className='userBlock'>
      <img src={humanIcon} alt="User Icon" className='userIcon' />
      <div className='userInfo'>
        <div className='username'>{username}</div>
        <div className='description'>{description}</div>
      </div>
    </div>
  );
};

export default UserBlock;
