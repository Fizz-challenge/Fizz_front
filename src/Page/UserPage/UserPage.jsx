import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserPage.css";
import EditPopup from "./EditPopup.jsx";
import SlideNav from "./SlideNav.jsx";

const UserPage = () => {
    const params = useParams();
	const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
	const [nowSelected, setNowSelected] = useState(0);
	const [categories, setCategories] = useState([]);
	// const [nowSelectedCategory, setNowSelectedCategory] = useState(0);
	const [editPopup, setEditPopup] = useState(false);

	useEffect(() => {
		// const fetchCategory = async () => {
		// 	try {
		// 		const res = await axios.get("http://localhost:8080/api/category");
		// 		setCategories(res.data);
		// 	} catch (err) {
		// 		console.error(`fetch err: ${err}`);
		// 	}
		// };

		// fetchCategory();
		setCategories(["헬스", "음악", "독서", "금욕", "스포츠"]);

		if (params.userId == "my-page" && !localStorage.getItem("nickname")) navigate("/login");
		// const fetchUserData = async () => {
		// 	try {
		// 		if (params.userId == "my-page") {
		// 			const res = await axios.get(`http://localhost:8080/api/user/${localStorage.getItem("nickname")}`);
		// 		} else {
		// 			const res = await axios.get(`http://localhost:8080/api/user/${params.userId}`);
		// 		}
		// 		setUserInfo(res.data);
		// 	} catch (err) {
		// 		console.error(`fetch err: ${err}`);
		// 	}
		// };

		// fetchUserData();

		setUserInfo({
            "id": 1,
            "nickname": "이건열자테스트입니다",
            "following": "100",
            "follower": "100",
            "profileImage": "undefined",
            "describe": "안녕하세요이건한줄설명스무자테스트입니다",
            "challenge": [
                {
                    "challengeId": 1,
					"categoryId": 1,
                    "title": "마라탕후루1"
                },
				{
                    "challengeId": 2,
					"categoryId": 1,
                    "title": "마라탕후루2"
                },
				{
                    "challengeId": 3,
					"categoryId": 1,
                    "title": "마라탕후루3"
                },
				{
                    "challengeId": 4,
					"categoryId": 1,
                    "title": "마라탕후루4"
                },
				{
                    "challengeId": 5,
					"categoryId": 1,
                    "title": "마라탕후루5"
                },
				{
                    "challengeId": 6,
					"categoryId": 1,
                    "title": "마라탕후루6"
                },
				{
                    "challengeId": 7,
					"categoryId": 1,
                    "title": "마라탕후루7"
                },
				{
                    "challengeId": 8,
					"categoryId": 1,
                    "title": "마라탕후루8"
                },
			]
        });
	}, []);

	const showEditPopup = () => {
		setEditPopup(true);
	}

	const logout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("nickname");
		navigate("/login");
	}

    return (
		<>
			<div className="content">
				{editPopup && (
					<EditPopup
						setEditPopup={setEditPopup}
						userInfo={userInfo}
					/>
				)}
				<div className="profileWrapper">
					<div className="profileImg"></div>
					<div className="profileName">{userInfo.nickname}</div>
					<div className="profileDesc">{userInfo.describe}</div>
					<div className="profileDynamicBtn">
						{location.pathname == "/profile/my-page" ? (
							<>
								<div
									className="profileBtn profileEditBtn"
									onClick={showEditPopup}
								>
									수정
								</div>
								<div
									className="profileBtn profileLogoutBtn"
									onClick={logout}
								>
									로그아웃
								</div>
							</>
						) : (
							<div className="profileBtn profileFollowBtn">
								팔로우
							</div>
						)}
					</div>
					<div className="profileStat">
						<div className="statFollower">
							팔로워
							<div>{userInfo.follower}</div>
						</div>
						<div className="statFollowing">
							팔로잉
							<div>{userInfo.following}</div>
						</div>
						<div className="statChallenges">
							참여
							<div>
								{userInfo.challenge &&
									userInfo.challenge.length}
							</div>
						</div>
					</div>
				</div>
				<SlideNav
					nowSelected={nowSelected}
					setNowSelected={setNowSelected}
				/>
				{/* <div className="categoryNav">
					{categories.map((item, index) => (
						<div
							key={index}
							className={
								nowSelectedCategory == `${index}`
									? "categories selectedCategory"
									: "categories"
							}
							onClick={() => {
								setNowSelectedCategory(index);
								console.log(index);
							}}
						>
							{item}
						</div>
					))}
				</div> */}
				<div className="contents">
					{userInfo.challenge &&
						userInfo.challenge.map((item) => (
							<div
								key={item.challengeId}
								className="contentChallenge"
							>
								<div className="contentChallengeTitle">
									{item.title}
								</div>
								<div className="contentChallengeCategory">
									#{categories[item.categoryId + 1]}
								</div>
							</div>
						))}
				</div>
			</div>
		</>
	);
}

export default UserPage;