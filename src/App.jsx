import "./App.css";
import Header from "./Components/Header";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./Page/MainPage/MainPage";
import VideoDetail from "./Page/DetailVideoPage/VideoDetail";
import FollowPage from "./Page/FollowPage/FollowPage";
import SearchPage from "./Page/SearchPage/SearchPage";
import LoginPage from "./Page/LoginPage/LoginPage.jsx";
import RegisterPage from "./Page/RegisterPage/RegisterPage.jsx";
import UserPage from "./Page/UserPage/UserPage.jsx";
import NewPost from './Page/NewPostPage/NewPost.jsx';
import ChallengePage from './Page/ChallengePage/ChallengePage.jsx';
import OAuth2Callback from "./Page/LoginPage/OAuth2Callback.jsx";
import DeleteProfilePage from "./Page/DeleteProfilePage/DeleteProfilePage.jsx";

function App() {
	const navigate = useNavigate();
	useEffect(() => {
		
	}, [navigate])
	return (
		<>
			{location.pathname !== "/login" && location.pathname !== "/register" && (<Header />)}
			<div className={`content-wrapper ${(location.pathname === "/login" || location.pathname === "/register") ? "noHeader" : ""}`}>
				<Routes>
					<Route exact path="/" element={<MainPage />} />
					<Route path="/video/:id" element={<VideoDetail />} />
					<Route path="/follow" element={<FollowPage />} />
					<Route path="/search" element={<SearchPage />} />
               		<Route path="/profile/:userId" element={<UserPage />} />
					<Route path="/new-post" element={<NewPost />} />
					<Route path="/challenge/:challenge" element={<ChallengePage />} />
               		<Route path="/oauth2/callback" element={<OAuth2Callback />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/delete-profile" element={<DeleteProfilePage />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
