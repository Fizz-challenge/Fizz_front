import React, { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import { Route, Routes } from 'react-router-dom';
import MainPage from './Page/MainPage/MainPage';
import VideoDetail from './Page/DetailVideoPage/VideoDetail';
import FollowPage from './Page/FollowPage/FollowPage';
import SearchPage from './Page/SearchPage/SearchPage';
import CategoryPage from './Page/SearchPage/CategoryPage';
import LoginPage from './Page/LoginPage/LoginPage';
import RegisterPage from './Page/RegisterPage/RegisterPage';
import UserPage from './Page/UserPage/UserPage';
import NewPost from './Page/NewPostPage/NewPost';
import ChallengePage from './Page/ChallengePage/ChallengePage';
import OAuth2Callback from './Page/LoginPage/OAuth2Callback';
import PageAlert from './Components/PageAlert'; // Import PageAlert component
import Modal from 'react-modal'; // Import react-modal

Modal.setAppElement('#root'); // Set the app element for accessibility

function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000); // Hide after 2 seconds
  };

  return (
    <>
      <Header />
      <div className="content-wrapper">
        <Routes>
          <Route exact path="/" element={<MainPage showAlert={showAlertMessage} />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/follow" element={<FollowPage showAlert={showAlertMessage} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/:userId" element={<UserPage />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/challenge/:challenge" element={<ChallengePage />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
      </div>
      {showAlert && <PageAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </>
  );
}

export default App;
