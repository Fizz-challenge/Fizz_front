import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import challengesData from './Challenges.json'; // 챌린지 데이터 임포트
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const categoryChallenges = challengesData.data[categoryName];
    setChallenges(categoryChallenges || []);
  }, [categoryName]);

  return (
    <div className="category-page-container">
      <h1>{categoryName} 챌린지</h1>
      <ul className="challenges-list">
        {challenges.map((challenge, index) => (
          <li key={index} className="challenge-item">{challenge}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
