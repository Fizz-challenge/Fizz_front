import React from 'react';
import './MainPage.css';
import Video from './Video';
import Buttons from './Buttons';

const videoData = {
  id: 1,
  src: 'path/to/video1.mp4',
  title: '오운완 챌린지',
  user: '사용자 이름',
  views: '34k',
  likes: '23.2k',
  comments: '1.2k',
  shares: '200',
};

const MainPage = () => {
  return (
    <div className="main-page">
      <div className="video-wrapper">
        <Video video={videoData} />
        <Buttons likes={videoData.likes} comments={videoData.comments} shares={videoData.shares} />
      </div>
    </div>
  );
};

export default MainPage;
