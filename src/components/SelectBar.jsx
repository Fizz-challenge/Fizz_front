import React from 'react';
import styles from './SelectBar.module.css';

const SelectBar = () => {
  return (
    <div className={styles.selectBar}>
      <button className={styles.toggleBtn}>팔로워 00명</button>
      <button className={`${styles.toggleBtn} ${styles.active}`}>팔로잉 00명</button>
    </div>
  );
};

export default SelectBar;
