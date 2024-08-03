import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchPage.css';
import SearchBar from '../../Components/SearchBar';
import CategoryThumbnail from './CategoryThumbnail';
import SlideBar from '../../Components/SlideBar';
import challengesData from './Challenges.json';
import ChallengeFolder from './ChallengeFolder';
import UserBlock from '../FollowPage/UserBlock'; // Import UserBlock component

const SearchPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState('popularity');
  const [categories, setCategories] = useState([]);
  const [nowSelected, setNowSelected] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSlideBar, setShowSlideBar] = useState(false);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://gunwoo.store/api/category');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get('term');
    if (term) {
      setSearchTerm(term);
      setShowSlideBar(true);

      const challenges = Object.keys(challengesData.data).reduce((acc, category) => {
        const filtered = challengesData.data[category].filter(challenge =>
          challenge.toLowerCase().includes(term.toLowerCase())
        );
        return [...acc, ...filtered];
      }, []);

      setFilteredChallenges(challenges);

      // TODO: 서버에서 사용자 데이터를 검색하는 API 호출로 대체합니다.
      const testUsers = [
        { id: 1, nickname: 'user1', describe: 'description1', profileImage: null, isFollowing: false },
        { id: 2, nickname: 'user2', describe: 'description2', profileImage: null, isFollowing: true }
      ];
      const filteredUsers = testUsers.filter(user =>
        user.nickname.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filteredUsers);
    }
  }, [location.search]);

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
            {filteredChallenges.map((challenge, index) => (
              <ChallengeFolder key={index} title={challenge} count="99+" />
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
              userId={user.id}
              username={user.nickname}
              description={user.describe}
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
              categories.map((category, index) => (
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
