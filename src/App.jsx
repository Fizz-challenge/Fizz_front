import "./App.css";
import Header from "./Components/Header";
import { Route, Routes } from "react-router-dom";
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
import OAuth2Callback from "./Page/LoginPage/OAuth2Callback.jsx";
import NewChallengePage from './Page/NewChallengePage/NewChallengePage.jsx';

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
          <Route path="/profile/:userId" element={<UserPage />} />
					<Route path="/new-post" element={<NewPost />} />
					<Route path="/challenge/:challenge" element={<ChallengePage />} />
					<Route path="/oauth2/callback" element={<OAuth2Callback />} />
					<Route path="/category/:categoryName" element={<CategoryPage />} />
					<Route path="/:id" element={<MainPage />} />
					<Route path="/new-challenge" element={<NewChallengePage />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
