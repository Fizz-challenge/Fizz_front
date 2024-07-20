import React from 'react';
import styles from './ChallengeBlock.module.css';

const ChallengeBlock = ({ title, tag, likes }) => {
  return (
    <div className={styles.block}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.tag}>#{tag}</p>
      <p className={styles.likes}>❤️ {likes}</p>
    </div>
  );
};

export default ChallengeBlock;
