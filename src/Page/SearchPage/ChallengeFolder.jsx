import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChallengeFolder.css';

const ChallengeFolder = ({ title, count, challengeId }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFirstPostThumbnail = async () => {
      try {
        const response = await fetch(`https://gunwoo.store/api/posts/challenges/${challengeId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success && result.data.content.length > 0) {
          setThumbnailUrl(result.data.content[0].fileUrls[1]);
        }
      } catch (error) {
        console.error('Error fetching first post thumbnail:', error);
      }
    };

    fetchFirstPostThumbnail();
  }, [challengeId]);

  const handleClick = () => {
    navigate(`/challenge/${title}`);
  };

  return (
    <div className="challenge-folder" onClick={handleClick}>
      <div className="image-container">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="large-image" />
        ) : (
          <div className="image-placeholder large-image"></div>
        )}
        <div className="challenge-info">
          <p className="challenge-title">{title}</p>
          <p className="challenge-count">{count}명 참여</p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFolder;
