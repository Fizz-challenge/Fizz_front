import React from 'react';
import { useParams } from 'react-router-dom';
import './ChallengePage.css';
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegCirclePlay } from "react-icons/fa6";


const ChallengePage = () => {
  const { challenge } = useParams();
  const images = [
    { id: 1, title: '이미지 1', url: '/img/test2.png' },
    { id: 2, title: '이미지 2', url: '/img/test2.png' },
    { id: 3, title: '이미지 3', url: '/img/test2.png' },
  ];

  return (
    <div className="challenge-page">
      <div className='challenge-page-container'>
      <div className='challenge-page-title'>
        <div className="challenge-dates">
          <p><MdOutlineDateRange />{" "}챌린지의 진행 기간</p>
        </div>
        <div className="challenge-box">
          <div>
            <span>#{challenge}</span>
            <div className="challenge-description">
              <div>
              <p>챌린지의 한줄 설명</p>
              </div>
                <div className="challenge-posts">
                <p><FaRegCirclePlay />23.2k의 사용자들이 참여하고 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="image-list">
        {images.map(image => (
          <div key={image.id} className="image-item">
            <img src={image.url} alt={image.title} className="image-preview" />
          </div>
        ))}
        </div>
        </div>
    </div>
  );
};

export default ChallengePage;
