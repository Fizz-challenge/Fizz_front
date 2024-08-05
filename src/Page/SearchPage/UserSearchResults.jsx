import React, { useState, useEffect } from 'react';
import UserBlock from '../FollowPage/UserBlock';
import "./UserSearchResults.css";

const UserSearchResults = ({ filteredUsers }) => {
  const [users, setUsers] = useState(filteredUsers);

  useEffect(() => {
    setUsers(filteredUsers);
  }, [filteredUsers]);

  const handleFollowToggle = (userId, isFollowing) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFollowing } : user
      )
    );
  };

  return users.length > 0 ? (
    <div className="users-container">
      {users.map((user) => (
        <UserBlock
          key={user.id}
          userProfileId={user.profileId}
          userId={user.id}
          username={user.nickname}
          description={user.aboutMe}
          profileImage={user.profileImage}
          isFollowing={user.isFollowing}
          onFollowToggle={(userId, isFollowing) => handleFollowToggle(user.id, isFollowing)}
        />
      ))}
    </div>
  ) : (
    <p className='NotFound'>사용자를 찾을 수 없습니다.</p>
  );
};

export default UserSearchResults;
