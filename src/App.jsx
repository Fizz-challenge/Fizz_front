import "./App.css";
import Header from "./Components/Header";
import NoticePopup from "./Components/NoticePopup.jsx";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import MainPage from "./Page/MainPage/MainPage";
import VideoDetail from "./Page/DetailVideoPage/VideoDetail";
import FollowPage from "./Page/FollowPage/FollowPage";
import SearchPage from "./Page/SearchPage/SearchPage";
import CategoryPage from './Page/SearchPage/CategoryPage.jsx';
import LoginPage from "./Page/LoginPage/LoginPage.jsx";
import RegisterPage from "./Page/RegisterPage/RegisterPage.jsx";
import UserPage from "./Page/UserPage/UserPage.jsx";
import NewPost from './Page/NewPostPage/NewPost.jsx';
import ChallengePage from './Page/ChallengePage/ChallengePage.jsx';
import OAuth2Callback from './Page/LoginPage/OAuth2Callback.jsx';
import DeleteProfilePage from './Page/DeleteProfilePage/DeleteProfilePage.jsx';
import NewChallengePage from './Page/NewChallengePage/NewChallengePage.jsx';
import AskPage from './Page/AskPage/AskPage.jsx';
import Modal from 'react-modal';
import TopBar from './Components/TopBar.jsx';

Modal.setAppElement('#root');

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await axios.get(`https://gunwoo.store/api/user/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
      } catch (err) {
        console.error(err);
        if (err.response.data.code === "U005") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("profileId");
          localStorage.removeItem("registration");
          if (location.pathname === "/profile/my-page") {
            navigate("/login");
          }
          setIsLogoutPopupVisible(true);
        } else {
          console.error(err);
        }
      }
    };

    if (localStorage.getItem("accessToken")) {
      fetchUserData();
    }
  }, [navigate, location.pathname]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    navigate(`/search?term=${term}`);
  };

  return (
    <>
      {isLogoutPopupVisible && (
        <NoticePopup
          setIsPopupVisible={setIsLogoutPopupVisible}
          popupStatus={[
            "세션이 만료되어 로그아웃합니다",
            "#ff7070",
          ]}
        />
      )}
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <>
          <TopBar onSearch={handleSearch} />
          <Header />
        </>
      )}
      <div className={`content-wrapper ${(location.pathname === "/login" || location.pathname === "/register") ? "noHeader" : ""}`}>
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/follow" element={<FollowPage />} />
          <Route path="/search" element={<SearchPage searchTerm={searchTerm} />} />
          <Route path="/profile/:userId" element={<UserPage />} />
          <Route path="/new-post/:challenge" element={<NewPost />} />
          <Route path="/challenge/:challenge" element={<ChallengePage />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/category/:categoryId/:categoryName" element={<CategoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/delete-profile" element={<DeleteProfilePage />} />
          <Route path="/:id" element={<MainPage />} />
          <Route path="/new-challenge" element={<NewChallengePage />} />
          <Route path="/ask" element={<AskPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
