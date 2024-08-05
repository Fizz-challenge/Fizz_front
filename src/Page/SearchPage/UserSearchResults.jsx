import React from 'react';
import UserBlock from '../FollowPage/UserBlock';

const UserSearchResults = ({ filteredUsers }) => {
  return filteredUsers.length > 0 ? (
    <div className="users-container">
      {filteredUsers.map((user) => (
        <UserBlock
          key={user.id}
          userProfileId={user.profileId}
          userId={user.id}
          username={user.nickname}
          description={user.aboutMe}
          profileImage={user.profileImage}
          isFollowing={user.isFollowing}
          onFollowToggle={() => console.log(`Toggle follow for user ${user.id}`)}
        />
      ))}
    </div>
  ) : (
    <p>사용자를 찾을 수 없습니다.</p>
  );
};

export default UserSearchResults;
