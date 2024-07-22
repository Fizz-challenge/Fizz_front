import React, { useState, useEffect } from 'react';
import UserBlock from '../../Components/UserBlock';
import Hashtag from '../../Components/Hashtag';
import getFollowData from './FollowData';
import './FollowPage.css';

// 팔로우 페이지
const FollowPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHashtags, setFilteredHashtags] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [viewType, setViewType] = useState('followers'); // 'followers' 또는 'following'으로 설정
  const [data, setData] = useState({
    following: '0',
    follower: '0',
    followingInfo: [],
    followingChallenge: [],
    followerInfo: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const followData = await getFollowData(0); // 첫 번째 인덱스의 데이터 가져오기
      setData(followData);
      setFilteredHashtags(followData.followingChallenge);
      setFilteredUsers(followData.followerInfo);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      if (viewType === 'followers') {
        setFilteredUsers(data.followerInfo);
      } else {
        setFilteredUsers(data.followingInfo);
        setFilteredHashtags(data.followingChallenge);
      }
    } else {
      setFilteredHashtags(
        data.followingChallenge.filter((tag) =>
          tag.challengeName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      if (viewType === 'followers') {
        setFilteredUsers(
          data.followerInfo.filter((user) =>
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else {
        setFilteredUsers(
          data.followingInfo.filter((user) =>
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    }
  }, [searchTerm, viewType, data]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewChange = (type) => {
    setViewType(type);
    setSearchTerm("");
  };

  return (
    <div className="container">
      <div className="mainContent">
        <div className="buttonContainer">
          <button
            className={`toggleButton ${viewType === 'followers' ? 'active' : ''}`}
            onClick={() => handleViewChange('followers')}
          >
            팔로워 {data.follower}명
          </button>
          <button
            className={`toggleButton ${viewType === 'following' ? 'active' : ''}`}
            onClick={() => handleViewChange('following')}
          >
            팔로잉 {data.following}명
          </button>
        </div>
        <div className="searchBar">
          <input
            type="text"
            placeholder="검색"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {viewType === 'following' && (
          <div className="List">
            <h1>태그</h1>
            {filteredHashtags.map((tag, index) => (
              <Hashtag key={index} tag={tag.challengeName} />
            ))}
          </div>
        )}
        <div className="List">
          <h1>{viewType === 'followers' ? '팔로워' : '팔로잉'}</h1>
          {filteredUsers.map((user, index) => (
            <UserBlock
              key={index}
              username={user.nickname}
              description={user.describe}
              profileImage={user.profileImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowPage;
