import React from 'react';
import styles from './UserBlock.module.css';
import humanIcon from '../../assets/human.png';

const UserBlock = ({ username, description }) => {
  return (
    <div className={styles.userBlock}>
      <img src={humanIcon} alt="User Icon" className={styles.userIcon} />
      <div className={styles.userInfo}>
        <div className={styles.username}>{username}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};

export default UserBlock;
