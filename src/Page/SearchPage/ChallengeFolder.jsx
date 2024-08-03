import React from 'react';
import './ChallengeFolder.css';

const ChallengeFolder = ({ title, count }) => {
  return (
    <div className="challenge-folder">
      <div className="image-container">
        <div className="image-placeholder large-image"></div>
        <div className="image-placeholder small-image"></div>
        <div className="challenge-info">
          <p className="challenge-title">{title}</p>
          <p className="challenge-count">{count}명 참여</p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFolder;
