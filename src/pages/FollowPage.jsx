import React from 'react';
import styles from './FollowPage.module.css';
import MenuBar from '../components/MenuBar';
import SelectBar from '../components/SelectBar';

const FollowPage = () => {
  return (
    <div className={styles.followPage}>
      <MenuBar/>
      <div className={styles.content}>
        <SelectBar/>
      </div>
    </div>
  );
};

export default FollowPage;
