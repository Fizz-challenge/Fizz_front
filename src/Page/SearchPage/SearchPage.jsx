import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchPage.css';
import SearchBar from '../../Components/SearchBar';
import CategoryThumbnail from './CategoryThumbnail';
import SlideBar from '../../Components/SlideBar';
import categoryData from './Category.json'; // Category.json 파일 import
import ChallengeFolder from './ChallengeFolder';
import UserBlock from '../FollowPage/UserBlock';

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const [nowSelected, setNowSelected] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSlideBar, setShowSlideBar] = useState(false);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchFollowingUsers = useCallback(async (token) => {
    try {
      const response = await fetch('https://gunwoo.store/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.success) {
        setFollowingUsers(result.data.following);
      }
    } catch (error) {
      console.error('Error fetching following users:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFollowingUsers(token);
    setLoading(false);
  }, [fetchFollowingUsers, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get('term');
    if (term) {
      setSearchTerm(term);
      setShowSlideBar(true);

      const fetchChallenges = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await fetch(`https://gunwoo.store/api/challenge/search?keyword=${term}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          if (result.success) {
            setFilteredChallenges(result.data);
          }
        } catch (error) {
          console.error('Error fetching challenges:', error);
        }
      };

      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await fetch(`https://gunwoo.store/api/user/search?nickname=${term}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          if (result.success) {
            const currentUserProfileId = localStorage.getItem('profileId');
            const filtered = result.data
              .filter(user => user.profileId !== currentUserProfileId)
              .map(user => ({
                ...user,
                isFollowing: followingUsers.some(followingUser => followingUser.profileId === user.profileId),
              }));
            setFilteredUsers(filtered);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchChallenges();
      fetchUsers();
    }
  }, [location.search, followingUsers, navigate]);

  const handleSearch = (term) => {
    navigate(`/search?term=${term}`);
  };

  const navItems = [
    {
      text: "챌린지"
    },
    {
      text: "사용자"
    },
    {
      text: "게시글"
    }
  ];

  const renderContent = () => {
    if (nowSelected === 0) {
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
    } else if (nowSelected === 1) {
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
    } else if (nowSelected === 2) {
      return <p>검색결과를 찾을 수 없습니다.</p>;
    }
  };

  return (
    <div className="search-page-container">
      <div className="search-page-main-content">
        <SearchBar className="search-page-search-bar" onSearch={handleSearch} />
        {showSlideBar && (
          <SlideBar nowSelected={nowSelected} setNowSelected={setNowSelected} items={navItems} />
        )}
        <div className="category-bar">
        </div>
        {!showSlideBar && (
          <div className="categories-grid">
            {loading ? (
              <p>Loading...</p>
            ) : (
              categoryData.data.map((category, index) => (
                <CategoryThumbnail key={index} category={category} />
              ))
            )}
          </div>
        )}
        {showSlideBar && (
          <div className="search-results">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
