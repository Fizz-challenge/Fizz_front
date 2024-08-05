import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
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
          const firstPost = result.data.content[0];
          const thumbnail = firstPost.fileType === 'VIDEO' ? firstPost.fileUrls[1] : firstPost.fileUrls[0];
          setThumbnailUrl(thumbnail);
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
    <div className="challengeFolder" onClick={handleClick}>
      <div className="imageContainer">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="largeImage" />
        ) : (
          <div className="imagePlaceholder largeImage"></div>
        )}
        <div className="challengeInfo">
          <p className="challengeTitle">#{title}</p>
          <p className="challengeCount">
            <FaUser className="user-Icon" /> {count}명 참여
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFolder;
