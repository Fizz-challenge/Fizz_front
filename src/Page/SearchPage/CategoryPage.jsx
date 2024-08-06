import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ChallengeFolder from './ChallengeFolder';
import iconMapping from './IconMapping';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryId, categoryName } = useParams();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch(`https://gunwoo.store/api/challenge/${categoryId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
          const sortedChallenges = data.data.sort((a, b) => b.participantCounts - a.participantCounts);
          setChallenges(sortedChallenges);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [categoryId]);

  const handleCreateChallenge = () => {
    navigate('/new-challenge');
  };

  return (
    <div className="category-page-container">
      <div className="category-title-container">
        {iconMapping[categoryName]}
        <h1>{categoryName} 챌린지</h1>
      </div>
      {loading ? (
        <div className="skeleton-container">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-item">
              <Skeleton height={150} />
              <Skeleton height={20} width={100} />
            </div>
          ))}
        </div>
      ) : challenges.length > 0 ? (
        <div className="challenges-list">
          {challenges.map((challenge) => (
            <ChallengeFolder
              key={challenge.challengeId}
              title={challenge.title}
              count={challenge.participantCounts}
              challengeId={challenge.challengeId}
              icon={iconMapping[categoryName]}
            />
          ))}
        </div>
      ) : (
        <div className="no-challenges">
          <p>아무도 {categoryName} 챌린지를 시작하지 않았네요...<br />새로운 챌린지를 만들어봐요!</p>
          <button className="createChallengeButton" onClick={handleCreateChallenge}>챌린지 만들기</button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
