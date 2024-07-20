import "./App.css";
import Header from "./Components/Header";
import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/MainPage/MainPage";
import VideoDetail from "./Pages/DetailVideoPage/VideoDetail";
import FollowPage from "./pages/FollowPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./Pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage/RegisterPage.jsx";
import UserPage from "./Pages/UserPage/UserPage.jsx";

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
