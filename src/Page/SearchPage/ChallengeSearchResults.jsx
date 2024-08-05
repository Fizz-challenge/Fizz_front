import React from 'react';
import ChallengeFolder from './ChallengeFolder';

const ChallengeSearchResults = ({ filteredChallenges }) => {
  return filteredChallenges.length > 0 ? (
    <div className="challenges-container">
      <div className="challenges-list">
        {filteredChallenges.map((challenge) => (
          <ChallengeFolder
            key={challenge.challengeId}
            title={challenge.title}
            count={challenge.participantCounts}
            challengeId={challenge.challengeId}
          />
        ))}
      </div>
    </div>
  ) : (
    <p>검색결과를 찾을 수 없습니다.</p>
  );
};

export default ChallengeSearchResults;
