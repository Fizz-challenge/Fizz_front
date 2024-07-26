import React, { useState, useEffect } from 'react';
import UserBlock from './UserBlock';
import getFollowData from './FollowData';
import SearchBar from '../../Components/SearchBar';
import './FollowPage.css';

const FollowPage = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [viewType, setViewType] = useState('followers'); 
  const [data, setData] = useState({
    following: '0',
    follower: '0',
    followingInfo: [],
    followerInfo: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      const followData = await getFollowData(0);
      setData(followData);
      setFilteredUsers(followData.followerInfo);
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSearch(""); // Clear search when viewType changes
  }, [viewType]);

  const handleSearch = (searchTerm) => {
    setCurrentPage(1);
    if (searchTerm === "") {
      if (viewType === 'followers') {
        setFilteredUsers(data.followerInfo);
      } else if (viewType === 'following') {
        setFilteredUsers(data.followingInfo);
      }
    } else {
      if (viewType === 'followers') {
        setFilteredUsers(
          data.followerInfo.filter((user) =>
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else if (viewType === 'following') {
        setFilteredUsers(
          data.followingInfo.filter((user) =>
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    }
  };

  const handleViewChange = (type) => {
    setViewType(type);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="follow-page">
      <div className="main-content">
        <div className="button-container">
          <button
            className={`toggle-button ${viewType === 'followers' ? 'active' : ''}`}
            onClick={() => handleViewChange('followers')}
          >
            팔로워 {data.follower}명
          </button>
          <button
            className={`toggle-button ${viewType === 'following' ? 'active' : ''}`}
            onClick={() => handleViewChange('following')}
          >
            팔로잉 {data.following}명
          </button>
        </div>
        <SearchBar onSearch={handleSearch} />
        <div className="list">
          <h1>{viewType === 'followers' ? '팔로워' : '팔로잉'}</h1>
          {currentUsers.map((user, index) => (
            <UserBlock
              key={index}
              userId={user.userID}
              username={user.nickname}
              description={user.describe}
              profileImage={user.profileImage}
            />
          ))}
        </div>
        <ul className="page-numbers">
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowPage;
