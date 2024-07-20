import React from 'react';
import styles from './Hashtag.module.css';

const Hashtag = ({ tag }) => {
  return (
    <div className={styles.tagBox}>
      <div className={styles.tag}>{tag}</div>
    </div>
  );
};

export default Hashtag;
