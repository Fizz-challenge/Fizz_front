import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoPlay, IoGrid, IoGridOutline } from "react-icons/io5";
import { FaComment, FaHeart } from "react-icons/fa6";
import { HiMiniTrash } from "react-icons/hi2";
import PostText from "./PostText.jsx";
import "./UserPosts.css"
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'

const UserPosts = ({ nowSelected, userPostInfo, convertNumber, setIsRemovePostPopupVisible, setSelectedPost, contentCount }) => {
    const navigate = useNavigate();

    const [participatedChallenges, setParticipatedChallenges] = useState(null);
	const [activeCreatedChallenges, setActiveCreatedChallenges] = useState(null);
	const [activeCreatedChallengesPosts, setActiveCreatedChallengesPosts] = useState([]);
	const [hiddenCreatedChallenges, setHiddenCreatedChallenges] = useState(null);
	const [likedChallenges, setLikedChallenges] = useState(null);

    useEffect(() => {
        const fetchChallengesData = async () => {
            try {
                const parChalRes = await axios.get(
                    "https://gunwoo.store/api/challenge/user/participate",
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );
                setParticipatedChallenges(parChalRes.data.data);
                // console.log("parChalRes", parChalRes.data.data);

                const actCreChalRes = await axios.get(
                    "https://gunwoo.store/api/challenge/user",
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );
                setActiveCreatedChallenges(actCreChalRes.data.data);
                // console.log("actCreChalRes", actCreChalRes.data.data);

                let resArr = [];
                actCreChalRes.data.data.map((item) => {
                    axios.get(
						`https://gunwoo.store/api/posts/challenges/${item.challengeId}`
					).then((response) => {
                        resArr.push(response.data.data.content)                        
                        setActiveCreatedChallengesPosts(resArr);
                        // console.log(resArr);
                        
                    });
                })                

                const hidCreChalRes = await axios.get(
                    "https://gunwoo.store/api/challenge/sleep/user",
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );
                setHiddenCreatedChallenges(hidCreChalRes.data.data);
                // console.log("hidCreChalRes", hidCreChalRes.data.data);

                const likChalRes = await axios.get(
                    "https://gunwoo.store/api/posts/users/like",
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );
                setLikedChallenges(likChalRes.data.data);
                // console.log("likChalRes", likChalRes.data.data);

            } catch (err) {
                console.error(err);
            }
        }

        // setTimeout(() => {
            fetchChallengesData();
        // }, 1000);
    }, []);

    const handlePostHover = (id) => {
        setSelectedPost(id);
    }

    const handleClickRemovePost = (event) => {
        event.stopPropagation();
        setIsRemovePostPopupVisible(true)
    }

    // const rootStyles = getComputedStyle(document.documentElement);
    // const postW = rootStyles.getPropertyValue('--contentsWidth').trim();
    // const postH = rootStyles.getPropertyValue('--postHeight').trim();
    // const descW = rootStyles.getPropertyValue('--descWidth').trim();    

    return (
		<>
			{/* <div className="profilePostSortNav">
                <div className="profilePostSortStatus">올린 게시물</div>
                <div className="profilePostSortButton">
                    <IoGridOutline />
                </div>
            </div> */}
			<div className="profilePosts">
				{nowSelected === 0 ? (
					userPostInfo ? (
						userPostInfo.content.length > 0 ? (
							userPostInfo.content.map((item) => (
								<div key={item.id} className="profilePost">
									<img
										className="profilePostThumbnail"
										src={item.fileUrls[1]}
										alt="썸네일"
									/>
									<div className="profilePostViewCount">
										<IoPlay className="profilePostIcon" />
										{convertNumber(item.viewCount)}
									</div>
									<div
										className="profilePostHover"
										onClick={() =>
											navigate(`/video/${item.id}`)
										}
										onMouseEnter={() =>
											handlePostHover(item.id)
										}
									>
										{location.pathname ===
											"/profile/my-page" && (
											<div
												className="profilePostRemove"
												onClick={handleClickRemovePost}
											>
												<HiMiniTrash className="profilePostRemoveIcon" />
											</div>
										)}
										<div className="profilePostLikeCount">
											<FaHeart className="profilePostIcon" />
											{convertNumber(item.likeCount)}
										</div>
										<div className="profilePostCommentCount">
											<FaComment className="profilePostIcon" />
											{convertNumber(item.commentCount)}
										</div>
									</div>
									<PostText text={item.title} type="title" />
									<PostText
										text={`#${item.challengeInfo.title}`}
										type="challenge"
									/>
								</div>
							))
						) : (
							location.pathname === "/profile/my-page" && (
								<div className="profilePostNotFound">
									이런, 아무것도 안 보이네요 🥺
									<div
										onClick={() => navigate("/new-post")}
										className="hoverBtns"
									>
										참여하기
									</div>
								</div>
							)
						)
					) : (
						// Array.from({ length: contentCount * 2 }, (_, index) => (
                        //     <div key={index} className="skT">
                        //         <Skeleton className="profilePostSkeleton" borderRadius="15px" width={postW} height={postH} />
                        //         <Skeleton className="profilePostTitleSkeleton" borderRadius="5px" width={postW} height="20px" />
                        //         <Skeleton className="profilePostChallengeSkeleton" borderRadius="5px" width={descW} height="20px" />
                        //     </div>
						// ))
                        <div></div>
					)
				) : nowSelected === 1 ? (
					activeCreatedChallenges ? (
						activeCreatedChallenges.length > 0 ? (
							activeCreatedChallenges.map((item, index) => (
								<div
									key={index}
									className="profilePost profilePostCards"
								>
									{activeCreatedChallengesPosts.length >
										index &&
										activeCreatedChallengesPosts[
											index
										][0] && (
											<img
												className="profilePostThumbnail"
												src={
													activeCreatedChallengesPosts[
														index
													][0].fileUrls[1]
												}
												alt="썸네일"
											/>
										)}
									<div
										className="profilePostCardHover"
										onClick={() =>
											navigate(`/challenge/${item.title}`)
										}
									>
										<div className="profilePostParticipantCount">
											<IoPlay className="profilePostIcon" />
											{`게시물 ${item.participantCounts}개`}
										</div>
									</div>
									<div className="profilePostCard1"></div>
									<div className="profilePostCard2"></div>
									<PostText
										text={`#${item.title}`}
										type="title"
									/>
									{activeCreatedChallengesPosts.length >
										index &&
										activeCreatedChallengesPosts[
											index
										][0] && (
											<PostText
												text={
													activeCreatedChallengesPosts[
														index
													][0].challengeInfo
														.description
												}
												type="desc"
											/>
										)}
								</div>
							))
						) : (
							location.pathname === "/profile/my-page" && (
								<div className="profilePostNotFound">
									이런, 아무것도 안 보이네요 🥺
									<div
										onClick={() =>
											navigate("/new-challenge")
										}
										className="hoverBtns"
									>
										제작하기
									</div>
								</div>
							)
						)
					) : (
                        // Array.from({ length: contentCount * 2 }, (_, index) => (
						// 	<div key={index} className="profilePost">
						// 		<div className="profilePostTitleSkeleton"></div>
						// 		<div className="profilePostChallengeSkeleton"></div>
						// 	</div>
						// ))
                        <div></div>
					)
				) : likedChallenges ? (
					likedChallenges.content.length > 0 ? (
						likedChallenges.content.map((item) => (
							<div key={item.id} className="profilePost">
								<img
									className="profilePostThumbnail"
									src={item.fileUrls[1]}
									alt="썸네일"
								/>
								<div className="profilePostViewCount">
									<IoPlay className="profilePostIcon" />
									{convertNumber(item.viewCount)}
								</div>
								<div
									className="profilePostHover"
									onClick={() =>
										navigate(`/video/${item.id}`)
									}
								>
									<div className="profilePostLikeCount">
										<FaHeart className="profilePostIcon" />
										{convertNumber(item.likeCount)}
									</div>
									<div className="profilePostCommentCount">
										<FaComment className="profilePostIcon" />
										{convertNumber(item.commentCount)}
									</div>
								</div>
								<img
									className="profilePostImg"
									src={
										item.userInfo.profileImage
											? item.userInfo.profileImage
											: "../src/assets/profile.jpg"
									}
									alt="프로필 이미지"
								/>
								<PostText text={item.title} type="titleMini" />
								<PostText
									text={`#${item.challengeInfo.title}`}
									type="challengeMini"
								/>
							</div>
						))
					) : (
						location.pathname === "/profile/my-page" && (
							<div className="profilePostNotFound">
								이런, 아무것도 안 보이네요 🥺
								<div
									onClick={() => navigate("/")}
									className="hoverBtns"
								>
									둘러보기
								</div>
							</div>
						)
					)
				) : (
                    <div></div>
				)}
			</div>
		</>
	);
}

export default UserPosts;