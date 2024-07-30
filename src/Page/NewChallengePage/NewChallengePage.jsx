import React, { useState, useRef } from 'react';
import './NewChallengePage.css';
import '../NewPostPage/NewPost.css';
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import FizzLogo from '../../assets/Fizz.png';
import Calendar from './Calendar';

const NewChallengePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);

  const datePickerRef = useRef(null);

  const handleTitleChange = (event) => {
    const value = event.target.value.replace(/#/g, ''); // # 문자를 제거합니다.
    setTitle(value.substring(0, 20));
    setTitleCharCount(value.length > 20 ? 20 : value.length);
  };
  
  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    setDescription(value.substring(0, 30));
    setDescriptionCharCount(value.length > 30 ? 30 : value.length);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Challenge Created:', { title, description, startDate, endDate });
  };

  const today = new Date();

  return (
    <div className="new-challenge-page">
      <div className="new-challenge-container">
        <img src={FizzLogo} alt="Fizz Logo"/>
        <form onSubmit={handleSubmit}>
          <div className="challenge-form">
            <label>챌린지 제목
              <span className='form-plus'><IoInformationCircleOutline />작성한 챌린지명은 #OOO 으로 생성됩니다. ex.오운완 → #오운완</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="challenge-input"
                placeholder='챌린지명을 작성해주세요'
                style={{width:"50%"}}
              />
              <span className="char-count">{titleCharCount}/20</span>
            </div>
            <label>해당 챌린지 설명</label>
            <div className="input-wrapper">
              <input
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                className='challenge-form-description'
                placeholder='챌린지에 대한 간단한 소개를 작성해주세요'
                style={{width:"60%"}}
              />
              <span className="char-count">{descriptionCharCount}/30</span>
            </div>
            <label className='data-select'>진행 날짜<span><FaCalendarAlt className="date-picker-icon"/></span></label>
            <div className="date-picker-container">
              <Calendar
                dateRange={dateRange}
                setDateRange={setDateRange}
                placeholderText="챌린지 시작일과 종료일"
                ref={datePickerRef}
              />
            </div>
          </div>
          <div className="upload-info">
            <div>
              <IoInformationCircleOutline />
              <span>챌린지 주제는 법적 문제를 일으킬 수 있는 내용을 포함하지 않아야 합니다.</span>
            </div>
            <div>
              <IoInformationCircleOutline />
              <span>참가자가 안전하게 챌린지에 참여할 수 있도록 유의하세요.</span>
            </div>
            <div>
              <IoInformationCircleOutline />
              <span>챌린지 관련 정보는 정확하고 신뢰할 수 있는 자료를 바탕으로 제공되어야 합니다.</span>
            </div>
            <div>
              <IoInformationCircleOutline />
              <span>챌린지를 주최할 때는 Fizz 커뮤니티 가이드라인을 준수해야 합니다.</span>
            </div>
          </div>
          <button type="submit" className="create-challenge-button">챌린지 생성</button>
        </form>
      </div>
    </div>
  );
};

export default NewChallengePage;
