import React, { useState } from 'react';
import './Buttons.css';
import { FaComment, FaShare } from 'react-icons/fa';
import ExampleIcon from './ExampleIcon';

const Buttons = ({ likes, comments, shares }) => {
  const [animate, setAnimate] = useState(false);

  const handleLikeClick = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1000);
  }

  return (
    <div className="buttons-container">
      <div className={`button-item ${animate ? 'animate' : ''}`} onClick={handleLikeClick}>
        <ExampleIcon className="svg-icon" />
        <div className="animation-container">
          <div className="fill"></div>
        </div>
      </div>
      <span>{likes}</span>
      <div className="button-item">
        <FaComment />
      </div>
      <span>{comments}</span>
      <div className="button-item">
        <FaShare />
      </div>
      <span>{shares}</span>
    </div>
  );
};

export default Buttons;
