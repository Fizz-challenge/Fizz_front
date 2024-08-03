import React, { useState, useEffect } from 'react';
import UserBlock from './UserBlock';
import getFollowData from './FollowData';
import SearchBar from '../../Components/SearchBar';
import PageAlert from '../../Components/PageAlert'; // Import PageAlert component
import './FollowPage.css';

const FollowPage = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [viewType, setViewType] = useState('followers'); 
  const [data, setData] = useState({
    following: [],
    follower: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [alertMessage, setAlertMessage] = useState(''); // 상태 선언
  const [showAlert, setShowAlert] = useState(false); // 상태 선언
  const usersPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      const followData = await getFollowData();
      setData({
        ...followData,
        following: followData.following,
        follower: followData.follower
      });
      setFilteredUsers(followData.follower);
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
        setFilteredUsers(data.follower);
      } else if (viewType === 'following') {
        setFilteredUsers(data.following);
      }
    } else {
      if (viewType === 'followers') {
        setFilteredUsers(
          data.follower.filter((user) =>
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else if (viewType === 'following') {
        setFilteredUsers(
          data.following.filter((user) =>
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    }
  };

  const handleViewChange = (type) => {
    setViewType(type);
    handleSearch("");  // Clear search when changing view
  };

  const handleFollowToggle = (userId) => {
    setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    setAlertMessage('언팔로우 하였습니다.');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000); // Hide alert after 2 seconds
    if (viewType === 'followers') {
      setData(prevData => ({
        ...prevData,
        follower: prevData.follower.filter(user => user.id !== userId)
      }));
    } else if (viewType === 'following') {
      setData(prevData => ({
        ...prevData,
        following: prevData.following.filter(user => user.id !== userId)
      }));
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(filteredUsers) ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser) : [];
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="follow-page">
      <div className="follow-page-main-content">
        <div className="button-container">
          <button
            className={`toggle-button ${viewType === 'followers' ? 'active' : ''}`}
            onClick={() => handleViewChange('followers')}
          >
            팔로워 {data.follower.length}명
          </button>
          <button
            className={`toggle-button ${viewType === 'following' ? 'active' : ''}`}
            onClick={() => handleViewChange('following')}
          >
            팔로잉 {data.following.length}명
          </button>
        </div>
        <div className="list">
          <h1>{viewType === 'followers' ? '팔로워' : '팔로잉'}</h1>
        </div>
        <div className="user-block-container">
          <SearchBar className="follow-page-search-bar" onSearch={handleSearch} />
          {currentUsers.map((user, index) => (
            <UserBlock
              key={index}
              userId={user.id}
              username={user.nickname}
              description={user.describe}
              profileImage={user.profileImage}
              isFollowing={viewType === 'following' || data.following.some(f => f.id === user.id)}
              viewType={viewType}
              onFollowToggle={() => handleFollowToggle(user.id)}
            />
          ))}
        </div>
        <ul className="page-numbers">
          {getPageNumbers().map((page, index) => (
            <li
              key={index}
              onClick={() => paginate(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </li>
          ))}
        </ul>
        {showAlert && <PageAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
      </div>
    </div>
  );
};

export default FollowPage;
