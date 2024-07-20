import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
import {
	IoAccessibilityOutline,
	IoAccessibility,
	IoAddCircleOutline,
	IoAddCircle,
	IoHeartOutline,
	IoHeart,
} from "react-icons/io5";
import Nav from "../components/Nav.jsx";
import "./UserPage.css";

const User = () => {
    // const params = useParams();
    const [userInfo, setUserInfo] = useState({});
	const [nowSelected, setNowSelected] = useState(0);
	const [categories, setCategories] = useState([]);
	const [nowSelectedCategory, setNowSelectedCategory] = useState(0);

	useEffect(() => {
		// const fetchData = async () => {
		// 	try {
		// 		const res = await axios.get("/api/category");
		// 		setCategories(res.data);
		// 	} catch (err) {
		// 		console.error(`fetch err: ${err}`);
		// 	}
		// };

		// fetchData();
		setCategories(["전체", "헬스", "음악", "독서", "금욕", "스포츠"]);
	}, []);

	useEffect(() => {
		// const fetchData = async () => {
		// 	try {
		// 		const res = await axios.get(`/api/user/${params.userId}`);
		// 		setUserInfo(res.data);
		// 	} catch (err) {
		// 		console.error(`fetch err: ${err}`);
		// 	}
		// };

		// fetchData();
		setUserInfo({
            "id": 1,
            "nickname": "사용자이름",
            "following": "100",
            "follower": "100",
            "profileImage": "undefined",
            "describe": "안녕하세요 이건 한줄설명입니다",
            "challenge": [
                {
                    "challengeId": 1,
                    "title": "마라탕후루1"
                },
				{
                    "challengeId": 2,
                    "title": "마라탕후루2"
                },
				{
                    "challengeId": 3,
                    "title": "마라탕후루3"
                },
				{
                    "challengeId": 4,
                    "title": "마라탕후루4"
                },
				{
                    "challengeId": 5,
                    "title": "마라탕후루5"
                },
				{
                    "challengeId": 6,
                    "title": "마라탕후루6"
                },
				{
                    "challengeId": 7,
                    "title": "마라탕후루7"
                },
				{
                    "challengeId": 8,
                    "title": "마라탕후루8"
                },
			]
        });
	}, []);

    return (
		<>
			<div className="content">
				<div className="profileImg"></div>
				<div className="profileName">{userInfo.nickname}</div>
				<div className="profileDesc">{userInfo.describe}</div>
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
							{userInfo.challenge && userInfo.challenge.length}
						</div>
					</div>
				</div>

				<div className="contentNav">
					<div
						className={`contentBtn joinedBtn ${
							nowSelected == 0 ? "selectedContent" : ""
						}`}
						onClick={() => setNowSelected(0)}
					>
						{nowSelected == 0 ? (
							<IoAccessibility className="ionicon" />
						) : (
							<IoAccessibilityOutline className="ionicon" />
						)}
						참여
					</div>
					<div
						className={`contentBtn createdBtn ${
							nowSelected == 1 ? "selectedContent" : ""
						}`}
						onClick={() => setNowSelected(1)}
					>
						{nowSelected == 1 ? (
							<IoAddCircle className="ionicon" />
						) : (
							<IoAddCircleOutline className="ionicon" />
						)}
						제작
					</div>
					<div
						className={`contentBtn likedBtn ${
							nowSelected == 2 ? "selectedContent" : ""
						}`}
						onClick={() => setNowSelected(2)}
					>
						{nowSelected == 2 ? (
							<IoHeart className="ionicon" />
						) : (
							<IoHeartOutline className="ionicon" />
						)}
						좋아요
					</div>
					<div className={`slideBtn select${nowSelected}`}></div>
				</div>
				<div className="categoryNav">
					{categories.map((item, index) => (
						<div
							key={index}
							className={
								nowSelectedCategory == `${index}`
									? "categories selectedCategory"
									: "categories"
							}
							onClick={() => {setNowSelectedCategory(index); console.log(index)}}
						>
							{item}
						</div>
					))}
				</div>
				<div className="contents">
					{userInfo.challenge &&
						userInfo.challenge.map((item) => (
							<div
								key={item.challengeId}
								className="contentChallenge"
							>
								<div>{item.title}</div>
							</div>
						))}
				</div>
			</div>
			<Nav />
		</>
	);
}

export default User;