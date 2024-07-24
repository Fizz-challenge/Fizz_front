import React from 'react';
import './Hashtag.css';

const Hashtag = ({ tag }) => {
  return (
    <div className='tagBox'>
      <div className='tag'>{'#'+tag}</div>
    </div>
  );
};

export default Hashtag;
