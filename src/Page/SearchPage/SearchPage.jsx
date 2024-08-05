import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchPage.css';
import CategoryThumbnail from './CategoryThumbnail';
import SlideBar from '../../Components/SlideBar';
import categoryData from './Category.json';
import ChallengeSearchResults from './ChallengeSearchResults';
import UserSearchResults from './UserSearchResults';
import PostSearchResults from './PostSearchResults';

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const [nowSelected, setNowSelected] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSlideBar, setShowSlideBar] = useState(false);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
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

      const fetchPosts = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await fetch(`https://gunwoo.store/api/posts/search?keyword=${term}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          if (result.success) {
            console.log('Fetched posts:', result.data.content);
            setFilteredPosts(result.data.content);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      fetchChallenges();
      fetchUsers();
      fetchPosts();
    }
  }, [location.search, followingUsers, navigate]);

  const handleSearch = (term) => {
    navigate(`/search?term=${term}`);
  };

  const navItems = [
    { text: "챌린지" },
    { text: "사용자" },
    { text: "게시글" }
  ];

  const renderContent = () => {
    if (nowSelected === 0) {
      return <ChallengeSearchResults filteredChallenges={filteredChallenges} />;
    } else if (nowSelected === 1) {
      return <UserSearchResults filteredUsers={filteredUsers} />;
    } else if (nowSelected === 2) {
      return <PostSearchResults filteredPosts={filteredPosts} />;
    }
  };

  return (
    <div className="search-page-container">
      <div className="search-page-main-content">
        {showSlideBar && (
          <SlideBar nowSelected={nowSelected} setNowSelected={setNowSelected} items={navItems} />
        )}
        <div className="category-bar"></div>
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
