import React from 'react';
import styles from './MenuBar.module.css';
import FizzLogo from '../assets/Fizz.png';

const MenuBar = () => {
  return (
    <div className={styles.menuBar}>
      <img src={FizzLogo} alt="Fizz Logo" className={styles.logo} />
      <button className={styles.menuBtn}>챌린지</button>
      <button className={styles.menuBtn}>탐색</button>
      <button className={styles.menuBtn}>만들기</button>
      <div className={styles.profileSection}>
        사용자이름
      </div>
    </div>
  );
};

export default MenuBar;
