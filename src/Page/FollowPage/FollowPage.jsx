import React, { useState, useEffect } from 'react';
import MenuBar from '../../Components/MenuBar';
import SelectBar from '../../Components/SelectBar';
import UserBlock from '../../Components/UserBlock';
import Hashtag from '../../Components/Hashtag';
import './FollowPage.css';

const FollowPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHashtags, setFilteredHashtags] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const hashtags = ["해시태그1", "해시태그2", "해시태그3", "해시태그4"];
  const users = [
    { username: "사용자1", description: "사용자 이름 or 한 줄 소개" },
    { username: "사용자2", description: "사용자 이름 or 한 줄 소개" },
    { username: "사용자3", description: "사용자 이름 or 한 줄 소개" },
    { username: "사용자4", description: "사용자 이름 or 한 줄 소개" }
  ];

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredHashtags(hashtags);
      setFilteredUsers(users);
    } else {
      setFilteredHashtags(
        hashtags.filter((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredUsers(
        users.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, hashtags, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container">
      <div className="mainContent">
        <SelectBar />
        <div className="searchBar">
          <input
            type="text"
            placeholder="검색"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="List">
          <h1>태그</h1>
          {filteredHashtags.map((tag, index) => (
            <Hashtag key={index} tag={tag} />
          ))}
        </div>
        <div className="List">
          <h1>계정</h1>
          {filteredUsers.map((user, index) => (
            <UserBlock
              key={index}
              username={user.username}
              description={user.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowPage;
