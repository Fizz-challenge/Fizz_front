import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	IoInformationCircleOutline,
	IoInformationCircle,
	IoPerson,
	IoMail,
	IoPlay,
} from "react-icons/io5";
import { FaComment, FaHeart } from "react-icons/fa6";
import axios from "axios";
import "./UserPage.css";
import "./UserPageMediaQuery.css";
import EditPopup from "./EditPopup.jsx";
import SlideNav from "./SlideNav.jsx";
import PostText from "./PostText.jsx";
import Warning from "../../Components/Warning.jsx";
import NoticePopup from "../../Components/NoticePopup.jsx";

const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowSize;
};

const UserPage = () => {
	const params = useParams();
	const navigate = useNavigate();

	const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
	const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);
	const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
	
	const [userInfo, setUserInfo] = useState({});
	const [userPostInfo, setUserPostInfo] = useState(null);
	const [profileNotFound, setProfileNotFound] = useState(false);
	const [participatedChallenges, setParticipatedChallenges] = useState([]);
	const [categories, setCategories] = useState([]);
	
	const [nowSelected, setNowSelected] = useState(0);
	
	const [isHoveringInfo, setIsHoveringInfo] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	
	const joinedRef = useRef(null);
	const profileNameRef = useRef(null);
	const profileInfoRef = useRef(null);
	
	const { width } = useWindowSize();
	const contentCount = Math.floor(width / 300) >= 2 ? Math.floor(width / 300) : 2;

	useEffect(() => {
		document.documentElement.style.setProperty('--contentCount', contentCount);
	}, [contentCount]);

	useEffect(() => {
		const fetchUserData = async () => {
			if (
				params.userId === "my-page" &&
				!localStorage.getItem("accessToken")
			) {
				navigate("/login");
				return;
			}

			try {
				let res;
				if (params.userId === "my-page") {
					res = await axios.get(`https://gunwoo.store/api/user/me`, {
						headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
					});
					setUserInfo(res.data.data);
					fetchUserPost(res.data.data.id);
					setProfileNotFound(false);

					const challengeRes = await axios.get(
						"https://gunwoo.store/api/challenge/user/participate",
						{
							headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
						}
					);
					setParticipatedChallenges(challengeRes.data.data);
				} else {
					res = await axios.get(
						`https://gunwoo.store/api/user/${params.userId}`
					);
					fetchUserPost(res.data.data.id);
					setUserInfo(res.data.data);					
					if (localStorage.getItem("accessToken")) {
						const myInfo = await axios.get(
							`https://gunwoo.store/api/user/me`,
							{
								headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
							}
						);
						if (
							myInfo.data.data.following.some(
								(profile) =>
									profile.profileId === res.data.data.profileId
							)
						) {
							setIsFollowing(true);
						}
					}
				}

			} catch (err) {
				if (err.response.data.code === "U005") {
					localStorage.removeItem("accessToken");
					localStorage.removeItem("profileId");
					localStorage.removeItem("registration");			
					setIsLogoutPopupVisible(true);
				} else {
					console.error(err);
					setProfileNotFound(true);
				}
			}
		};

		if (params.userId === localStorage.getItem("profileId")) {
			navigate("/profile/my-page");
		} else {
			// setTimeout(() => {
				fetchUserData();
			// }, 1000);
		}
	}, [navigate, params.userId, isFollowing]);

	const fetchUserPost = async (id) => {
		const userPost = await axios.get(`https://gunwoo.store/api/posts/users/${id}`)
		// setTimeout(() => {
			setUserPostInfo(userPost.data.data);
		// }, 2000);
		console.log(userPost.data.data);
		
	}

	const showEditPopup = () => setIsEditPopupVisible(true);

	const logout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("profileId");
		localStorage.removeItem("registration");
		navigate("/");
	};

	const convertNumber = (num) => {
		if (num < 1000) return num.toString();
		if (num < 10000) return (num / 1000).toFixed(1) + "K";
		if (num < 100000) return Math.round(num / 1000) + "K";
		if (num < 1000000) return (num / 1000000).toFixed(1) + "M";
		return Math.round(num / 1000000) + "M";
	};

	const onClickJoined = () => joinedRef.current.click();

	const followRequest = async () => {
		if (localStorage.getItem("accessToken")) {
			try {
				await axios.post(
					`https://gunwoo.store/api/user/following/${userInfo.id}`,
					{},
					{
						headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
					}
				);
				setIsFollowing(true);
			} catch (err) {
				console.error(err);
			}
		} else {
			setIsLoginPopupVisible(true);
		}
	};

	const unFollowRequest = async () => {
		try {
			await axios.delete(
				`https://gunwoo.store/api/user/following/${userInfo.id}`,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
				}
			);
			setIsFollowing(false);
		} catch (err) {
			console.error(err);
		}
	};

	const toLogin = () => navigate("/login");

	const contactCategory = async () => {
		try {
			await axios
				.post(
					`https://gunwoo.store/api/category/user`,
					{
						title: "테스트",
						description: "테스트요청입니다",
					},
					{
						headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
					}
				)
				.catch((err) => console.error(err));
		} catch (err) {
			console.error(err);
		}
	};

	if (profileNotFound) {
		return <Warning message="존재하지 않는 사용자입니다🫤" />;
	} else {
		return (
			<>
				{isLogoutPopupVisible && (
					<NoticePopup
						setIsPopupVisible={setIsLogoutPopupVisible}
						popupStatus={[
							"세션이 만료되어 로그아웃합니다",
							"#ff7070",
						]}
						onClose={
							location.pathname === "/profile/my-page"
								? logout
								: null
						}
					/>
				)}
				{isLoginPopupVisible && (
					<NoticePopup
						setIsPopupVisible={setIsLoginPopupVisible}
						popupStatus={[
							"팔로우는 로그인이 필요합니다",
							"#2DA7FF",
						]}
						buttonStatus={{
							bgcolor: "#2DA7FF",
							color: "#ffffff",
							msg: "로그인",
							action: toLogin,
						}}
					/>
				)}
				{isEditPopupVisible && (
					<EditPopup
						setIsEditPopupVisible={setIsEditPopupVisible}
						userInfo={userInfo}
					/>
				)}
				<div className="profileWrapper">
					<div className="profileImg">
						{userInfo.profileImage && (
							<img
								src={userInfo.profileImage}
								alt="프로필 이미지"
							/>
						)}
					</div>
					{userInfo.nickname ? (
						<>
							<div className="profileName" ref={profileNameRef}>
								{userInfo.nickname}
								<span
									onMouseEnter={() => setIsHoveringInfo(true)}
									onMouseLeave={() =>
										setIsHoveringInfo(false)
									}
								>
									{isHoveringInfo ? (
										<>
											<IoInformationCircle className="profileInfoIcon" />
											<div
												className="profileInfo"
												ref={profileInfoRef}
												style={
													profileNameRef.current.getBoundingClientRect()
														.width < 150
														? {
																left: `${
																	profileNameRef.current.getBoundingClientRect()
																		.width +
																	40
																}px`,
																borderRadius:
																	"0px 10px 10px 10px",
														  }
														: {
																right: "-10px",
																borderRadius:
																	"10px 0px 10px 10px",
														  }
												}
											>
												<IoPerson className="infoIcons" />{" "}
												{userInfo.profileId}
												<br />
												<IoMail className="infoIcons" />{" "}
												{userInfo.email}
											</div>
										</>
									) : (
										<IoInformationCircleOutline className="profileInfoIcon" />
									)}
								</span>
							</div>
							<div className="profileDesc">
								{userInfo.aboutMe}
							</div>
						</>
					) : (
						<>
							{/* <div className="profileNameSkeleton"></div>
							<div className="profileDescSkeleton"></div> */}
						</>
					)}
					<div className="profileDynamicBtn">
						{location.pathname === "/profile/my-page" ? (
							<>
								<div
									className="profileBtn profileEditBtn hoverBtns"
									onClick={showEditPopup}
								>
									수정
								</div>
								<div
									className="profileBtn profileLogoutBtn hoverBtns"
									onClick={logout}
								>
									로그아웃
								</div>
							</>
						) : isFollowing ? (
							<div
								className="profileBtn profileUnFollowBtn hoverBtns"
								onClick={unFollowRequest}
							>
								팔로우 취소
							</div>
						) : (
							<div
								className="profileBtn profileFollowBtn hoverBtns"
								onClick={followRequest}
							>
								팔로우
							</div>
						)}
					</div>
					<div className="profileStat">
						<div className="statFollower">
							팔로워
							<div>
								{userInfo.follower
									? convertNumber(userInfo.follower.length)
									: "0"}
							</div>
						</div>
						<div className="statFollowing">
							팔로잉
							<div>
								{userInfo.following
									? convertNumber(userInfo.following.length)
									: "0"}
							</div>
						</div>
						<div className="statChallenges">
							참여
							<div onClick={onClickJoined}>
								{/* {participatedChallenges &&
									convertNumber(
										participatedChallenges.length
									)} */}
								{userPostInfo
									? convertNumber(userPostInfo.content.length)
									: "0"}
							</div>
						</div>
					</div>
				</div>
				<SlideNav
					nowSelected={nowSelected}
					setNowSelected={setNowSelected}
					joinedRef={joinedRef}
					type={params.userId === "my-page" && params.userId}
				/>
				<div className="profilePosts">
					{userPostInfo ? (
						userPostInfo.content.length > 0 ? (
							userPostInfo.content.map((item) => (
								<div key={item.id} className="profilePost">
									<img src={item.fileUrls[1]} alt="썸네일" />
									<div className="profilePostViewCount">
										<IoPlay className="profilePostIcon" />
										{convertNumber(item.viewCount)}
									</div>
									<div className="profilePostHover">
										<div className="profilePostLikeCount">
											<FaHeart className="profilePostIcon" />
											{convertNumber(item.likeCount)}
										</div>
										<div className="profilePostCommentCount">
											<FaComment className="profilePostIcon" />
											{convertNumber(item.commentCount)}
										</div>
									</div>
									<PostText
										text={item.title}
										type="title"
									/>
									<PostText
										text={item.challengeInfo.title}
										type="challenge"
									/>
								</div>
							))
						) : params.userId === "my-page" && (
							<div className="profilePostNotFound">
								이런, 아무것도 안 보이네요 🥺
								<div onClick={() => navigate("/new-post")} className="hoverBtns">참여하기</div>
							</div>
						)
					) : (
						// Array.from({ length: contentCount * 2 }, (_, index) => (
						// 	<div key={index} className="profilePost">
						// 		<div className="profilePostTitleSkeleton"></div>
						// 		<div className="profilePostChallengeSkeleton"></div>
						// 	</div>
						// ))
						<div></div>
					)}
				</div>
			</>
		);
	}
};

export default UserPage;
