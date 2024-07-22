import React, { useState } from 'react';
import MenuBar from '../../Components/MenuBar';
import ChallengeBlock from '../../Components/ChallengeBlock';
import './SearchPage.css';

const SearchPage = () => {
  const categories = ["헬스", "악기", "독서", "금융", "스포츠", "공부"]; // 예시 카테고리 리스트

  const challenges = [
    { title: "헬스 챌린지 1", tag: "헬스", likes: 42 },
    { title: "헬스 챌린지 2", tag: "헬스", likes: 67 },
    { title: "헬스 챌린지 3", tag: "헬스", likes: 89 },
    { title: "헬스 챌린지 4", tag: "헬스", likes: 12 },
    { title: "악기 챌린지 1", tag: "악기", likes: 54 },
    { title: "악기 챌린지 2", tag: "악기", likes: 37 },
    { title: "악기 챌린지 3", tag: "악기", likes: 78 },
    { title: "악기 챌린지 4", tag: "악기", likes: 61 },
    { title: "독서 챌린지 1", tag: "독서", likes: 25 },
    { title: "독서 챌린지 2", tag: "독서", likes: 90 },
    { title: "독서 챌린지 3", tag: "독서", likes: 46 },
    { title: "독서 챌린지 4", tag: "독서", likes: 74 },
    { title: "금융 챌린지 1", tag: "금융", likes: 58 },
    { title: "금융 챌린지 2", tag: "금융", likes: 33 },
    { title: "금융 챌린지 3", tag: "금융", likes: 95 },
    { title: "금융 챌린지 4", tag: "금융", likes: 47 },
    { title: "스포츠 챌린지 1", tag: "스포츠", likes: 86 },
    { title: "스포츠 챌린지 2", tag: "스포츠", likes: 14 },
    { title: "스포츠 챌린지 3", tag: "스포츠", likes: 70 },
    { title: "스포츠 챌린지 4", tag: "스포츠", likes: 21 },
    { title: "공부 챌린지 1", tag: "공부", likes: 63 },
    { title: "공부 챌린지 2", tag: "공부", likes: 29 },
    { title: "공부 챌린지 3", tag: "공부", likes: 88 },
    { title: "공부 챌린지 4", tag: "공부", likes: 35 }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChallenges, setFilteredChallenges] = useState(challenges);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      setFilteredChallenges(challenges);
    } else {
      setFilteredChallenges(
        challenges.filter(challenge =>
          challenge.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="container">
      <div className="mainContent">
        <form className="searchBar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="검색"
            value={searchTerm}
            onChange={handleSearch}
          />
        </form>
        <div className="categories">
          {categories.map((category, index) => (
            <button key={index} className="categoryButton">
              {category}
            </button>
          ))}
        </div>
        <div className="allChallenges">
          {categories.map((category, index) => (
            <div key={index} className="categorySection">
              <div className="challenges">
                {filteredChallenges
                  .filter(challenge => challenge.tag === category)
                  .map((challenge, index) => (
                    <ChallengeBlock
                      key={index}
                      title={challenge.title}
                      tag={challenge.tag}
                      likes={challenge.likes}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
