import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChallengeFolder from './ChallengeFolder';
import './CategoryPage.css';
import categoryData from './Category.json';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch category details from Category.json
    const selectedCategory = categoryData.find(cat => cat.name === categoryName);
    if (selectedCategory) {
      setCategory(selectedCategory);
      // Simulate fetching challenges for the category
      const testChallenges = [
        {
          challengeId: 1,
          categoryId: selectedCategory.id,
          title: `${selectedCategory.name} 챌린지 1`,
          participantCounts: 10
        },
        {
          challengeId: 2,
          categoryId: selectedCategory.id,
          title: `${selectedCategory.name} 챌린지 2`,
          participantCounts: 20
        }
      ];
      setChallenges(testChallenges);
    }
    setLoading(false);
  }, [categoryName]);

  const handleCreateChallenge = () => {
    navigate('/new-post');
  };

  return (
    <div className="category-page-container">
      <h1>{categoryName} 챌린지</h1>
      {category && (
        <div className="category-details">
          <img src={`/img/${category.image}`} alt={category.name} className="category-image" />
          <p>{category.description}</p>
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : challenges.length > 0 ? (
        <div className="challenges-list">
          {challenges.map((challenge) => (
            <ChallengeFolder
              key={challenge.challengeId}
              title={challenge.title}
              count={challenge.participantCounts}
            />
          ))}
        </div>
      ) : (
        <div className="no-challenges">
          <p>아무도 {categoryName} 챌린지를 시작하지 않았네요... 저희 함께 해봐요!</p>
          <button className="create-challenge-button" onClick={handleCreateChallenge}>게시물 만들기</button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
