import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserBlock from './UserBlock';
import SearchBar from '../../Components/SearchBar';
import './FollowPage.css';

const FollowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [viewType, setViewType] = useState('followers'); 
  const [data, setData] = useState({
    following: [],
    follower: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 11;
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.has('content')) {
      params.set('content', '0');
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [location.search, navigate]);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://gunwoo.store/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
          }
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
          const { follower, following } = result.data;
          setData({
            following,
            follower
          });
          const params = new URLSearchParams(location.search);
          const contentType = params.get('content');
          if (contentType === '1') {
            setViewType('following');
            setFilteredUsers(following);
          } else {
            setViewType('followers');
            setFilteredUsers(follower);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate, location.search]);

  useEffect(() => {
    handleSearch(""); // Clear search when viewType changes
  }, [viewType]);

  const handleSearch = (searchTerm) => {
    setCurrentPage(1);
    if (searchTerm.trim() === "") {
      setFilteredUsers(viewType === 'followers' ? data.follower : data.following);
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
    setFilteredUsers(type === 'followers' ? data.follower : data.following);
    navigate(`/follow?content=${type === 'followers' ? '0' : '1'}`);
  };

  const handleFollowToggle = (userId, isFollowing) => {
    setData(prevData => {
      const updatedFollower = prevData.follower.map(user => 
        user.id === userId ? { ...user, isFollowing } : user
      );

      const updatedFollowing = isFollowing 
        ? [...prevData.following, prevData.follower.find(user => user.id === userId)]
        : prevData.following.filter(user => user.id !== userId);

      return {
        follower: updatedFollower,
        following: updatedFollowing,
      };
    });

    setFilteredUsers(prevUsers => {
      if (viewType === 'followers') {
        return prevUsers.map(user => 
          user.id === userId ? { ...user, isFollowing } : user
        );
      } else if (viewType === 'following') {
        return isFollowing 
          ? [...prevUsers, data.follower.find(user => user.id === userId)]
          : prevUsers.filter(user => user.id !== userId);
      }
      return prevUsers;
    });
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
    <div className="followPage">
      <div className="followPageMainContent">
        <div className="slideBar-Wrapper">
          <div className="slideBar">
            <div
              className={`slideBarBtn ${viewType === 'followers' ? 'slideBarSelectedContent' : ''}`}
              onClick={() => handleViewChange('followers')}
            >
              팔로워 {data.follower.length}명
            </div>
            <div
              className={`slideBarBtn ${viewType === 'following' ? 'slideBarSelectedContent' : ''}`}
              onClick={() => handleViewChange('following')}
            >
              팔로잉 {data.following.length}명
            </div>
            <div className={`slideBtn ${viewType === 'followers' ? 'Select0' : 'Select1'}`}></div>
          </div>
        </div>
        <div className="list">
          <h1>{viewType === 'followers' ? '팔로워' : '팔로잉'}</h1>
        </div>
        <div className="userBlockContainer">
          <SearchBar className="followPageSearchBar" onSearch={handleSearch} />
          {currentUsers.map((user, index) => (
            <UserBlock
              key={index}
              userId={user.id}
              userProfileId={user.profileId}
              username={user.nickname}
              description={user.aboutMe}
              profileImage={user.profileImage}
              isFollowing={user.isFollowing || data.following.some(f => f.id === user.id)}
              onFollowToggle={handleFollowToggle}
            />
          ))}
        </div>
        <ul className="pageNumbers">
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
      </div>
    </div>
  );
};

export default FollowPage;
