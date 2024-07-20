import "./App.css";
import Header from "./Components/Header";
import { Route, Routes } from "react-router-dom";
import MainPage from "./Page/MainPage/MainPage";
import VideoDetail from "./Page/DetailVideoPage/VideoDetail";
import FollowPage from "./Page/FollowPage/FollowPage";
import SearchPage from "./Page/SearchPage/SearchPage";
import LoginPage from "./Page/LoginPage/LoginPage.jsx";
import RegisterPage from "./Page/RegisterPage/RegisterPage.jsx";
import UserPage from "./Page/UserPage/UserPage.jsx";

function App() {
	return (
		<>
			<Header />
			<div className="content-wrapper">
				<Routes>
					<Route exact path="/" element={<MainPage />} />
					<Route path="/video/:id" element={<VideoDetail />} />
					<Route path="/follow" element={<FollowPage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/user/:userId" element={<UserPage />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
