import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
	IoInformationCircleOutline,
	IoInformationCircle,
	IoPerson,
	IoMail,
} from "react-icons/io5";
import axios from "axios";
import "./UserPage.css";
import "./UserPageMediaQuery.css";
import Skeleton from "react-loading-skeleton";
import EditPopup from "./EditPopup.jsx";
import SlideNav from "./SlideNav.jsx";
import UserPosts from "./UserPosts.jsx";
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
	const [searchParams] = useSearchParams();
	const paramContent = searchParams.get("content");
	const navigate = useNavigate();

	const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
	const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
	const [isRemovePostPopupVisible, setIsRemovePostPopupVisible] = useState(false);
	
	const [userInfo, setUserInfo] = useState({});
	const [userPostInfo, setUserPostInfo] = useState(null);
	const [profileNotFound, setProfileNotFound] = useState(false);
	
	const [nowSelected, setNowSelected] = useState(0);
	const [selectedPost, setSelectedPost] = useState();
	
	const [isHoveringInfo, setIsHoveringInfo] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	
	const joinedRef = useRef(null);
	const createdRef = useRef(null);
	const likedRef = useRef(null);

	const profileNameRef = useRef(null);
	const profileInfoRef = useRef(null);
	
	const { width } = useWindowSize();
	const contentCount = Math.floor(width / 310) >= 2 ? Math.floor(width / 310) : 2;

	useEffect(() => {
		document.documentElement.style.setProperty('--contentCount', contentCount);
	}, [contentCount]);

	useEffect(() => {		
		if (
			params.userId === "my-page" &&
			!localStorage.getItem("accessToken")
		) {
			navigate("/login");
			return;
		}
		const fetchUserData = async () => {
			try {
				let res;
				if (params.userId === "my-page") {
					res = await axios.get(`https://gunwoo.store/api/user/me`, {
						headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
					});
					setUserInfo(res.data.data);
					// console.log(res.data.data);
					fetchUserPost(res.data.data.id);
					setProfileNotFound(false);
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
				if (err.response.data.code !== "U005") {
					console.error(err);
					setProfileNotFound(true);
				}
			}
		};

		if (params.userId === localStorage.getItem("profileId")) {
			navigate("/profile/my-page");
		} else {
			setTimeout(() => {
				fetchUserData();
			}, 1000);
		}

		if (paramContent === "0") {
			joinedRef.current.click();
		} else if (paramContent === "1") {
			createdRef.current.click();
		} else if (paramContent === "2") {
			likedRef.current.click();
		}
	}, [navigate, params.userId, isFollowing]);

	useEffect(() => {
		setUserInfo({})
		setUserPostInfo(null);
	}, [navigate])


	const fetchUserPost = async (id) => {
		// setUserPostInfo(null);
		// setTimeout(async () => {
			try {
				let page = 0;
				let getMore = true;
				let allPost = []
				while (getMore) {
					const userPost = await axios.get(
						`https://gunwoo.store/api/posts/users/${id}?page=${page}`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem(
									"accessToken"
								)}`,
							},
						}
					);
					const newChallenges = userPost.data.data.content;
					// console.log(userPost.data.data.content, id);
					
					// if (userPostInfo !== null && userPostInfo[0].userInfo.id === id) {
					// 	console.log(123);
						
					// 	setUserPostInfo((prev) => [...prev, ...newChallenges]);
					// } else {
					// 	setUserPostInfo(newChallenges);
					// }
					allPost.push(...newChallenges)
					page++;
					if (
						userPost.data.data.page.totalPages < page + 1 ||
						userPost.data.data.page.totalPages === 0
					) {
						getMore = false;
					}
				}
				setUserPostInfo(allPost)
			} catch (err) {
				console.error(err);
			}
		// }, 1000);
	};

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

	const removePost = async () => {
        try {
            const res = await axios.delete(
                `https://gunwoo.store/api/posts/${selectedPost}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                }
            );
			window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

	if (profileNotFound) {
		return <Warning message="존재하지 않는 사용자입니다🫤" />;
	} else {
		return (
			<>
				{isRemovePostPopupVisible && (
					<NoticePopup
						setIsPopupVisible={setIsRemovePostPopupVisible}
						popupStatus={["정말 삭제하시겠습니까?", "#ff3636"]}
						buttonStatus={{
							bgcolor: "#ff3636",
							color: "#ffffff",
							msg: "삭제",
							action: removePost,
						}}
						noButton={true}
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
					<div className="profileImg" style={{ userSelect: "none" }}>
						{userInfo.profileImage ? (
							<img
								src={userInfo.profileImage}
								alt="프로필 이미지"
							/>
						) : (
							<Skeleton className="profileImgSkeleton" width="150px" height="150px" borderRadius="50%" />
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
							<Skeleton className="profileNameSkeleton" width="150px" height="40px" borderRadius="5px" />
							<Skeleton className="profileDescSkeleton" width="200px" height="20px" borderRadius="5px" />
						</>
					)}
					{userInfo.nickname ? (
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
					) : (
						<Skeleton className="profileDynamicBtnSkeleton" width="80px" height="30px" borderRadius="20px"/>
					)}
					<div className="profileStat">
						<div className="statFollower">
							팔로워
							<div onClick={() => navigate("/follow?content=0")}>
								{userInfo.follower
									? convertNumber(userInfo.follower.length)
									: <Skeleton width="50px" borderRadius="50px" />}
							</div>
						</div>
						<div className="statFollowing">
							팔로잉
							<div onClick={() => navigate("/follow?content=1")}>
								{userInfo.following
									? convertNumber(userInfo.following.length)
									: <Skeleton width="50px" borderRadius="50px" />}
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
									? convertNumber(userPostInfo.length)
									: <Skeleton width="50px" borderRadius="50px" />}
							</div>
						</div>
					</div>
				</div>
				{location.pathname === "/profile/my-page" && (
					<SlideNav
						nowSelected={nowSelected}
						setNowSelected={setNowSelected}
						joinedRef={joinedRef}
						createdRef={createdRef}
						likedRef={likedRef}
					/>
				)}
				<UserPosts
					nowSelected={nowSelected}
					setNowSelected={setNowSelected}
					userPostInfo={userPostInfo}
					convertNumber={convertNumber}
					setIsRemovePostPopupVisible={setIsRemovePostPopupVisible}
					setSelectedPost={setSelectedPost}
					contentCount={contentCount}
				/>
			</>
		);
	}
};

export default UserPage;
