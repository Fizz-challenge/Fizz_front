import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoPlay, IoGrid, IoGridOutline } from "react-icons/io5";
import { FaComment, FaHeart } from "react-icons/fa6";
import { HiMiniTrash } from "react-icons/hi2";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import PostText from "./PostText.jsx";
import "./UserPosts.css";

const UserPosts = ({ 
    nowSelected, 
	setNowSelected,
    userPostInfo, 
    convertNumber, 
    setIsRemovePostPopupVisible, 
    setSelectedPost, 
}) => {
    const navigate = useNavigate();

    const [participatedChallenges, setParticipatedChallenges] = useState(null);
    const [participatedChallengesPosts, setParticipatedChallengesPosts] = useState(null);
    const [activeCreatedChallenges, setActiveCreatedChallenges] = useState(null);
    const [activeCreatedChallengesPosts, setActiveCreatedChallengesPosts] = useState([]);
    const [hiddenCreatedChallenges, setHiddenCreatedChallenges] = useState(null);
    const [hiddenCreatedChallengesPosts, setHiddenCreatedChallengesPosts] = useState(null);
    const [likedChallenges, setLikedChallenges] = useState(null);

    const [postChallengeMode, setPostChallengeMode] = useState("post");
    const [activeSleepMode, setActiveSleepMode] = useState("active");

	// const [isHoveringProfile, setIsHoveringProfile] = useState(false);

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

                let resParArr = {};
                await Promise.all(
                    parChalRes.data.data.map(async (item) => {
                        let resPar = { data: [], desc: "" };
                        const postRes = await axios.get(
                            `https://gunwoo.store/api/posts/challenges/${item.challengeId}`
                        );
                        resPar.data = postRes.data.data.content;

                        const infoRes = await axios.get(
                            `https://gunwoo.store/api/challenge/info/${item.challengeId}`
                        );
                        resPar.desc = infoRes.data.data.description;

                        resParArr[item.challengeId] = resPar;
                    })
                );
                setParticipatedChallengesPosts(resParArr);

                const actCreChalRes = await axios.get(
                    "https://gunwoo.store/api/challenge/user",
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );
                setActiveCreatedChallenges(actCreChalRes.data.data);

                let resActArr = {};
                await Promise.all(
                    actCreChalRes.data.data.map(async (item) => {
                        let resAct = { data: [], desc: "" };
                        const postRes = await axios.get(
                            `https://gunwoo.store/api/posts/challenges/${item.challengeId}`
                        );
                        resAct.data = postRes.data.data.content;

                        const infoRes = await axios.get(
                            `https://gunwoo.store/api/challenge/info/${item.challengeId}`
                        );
                        resAct.desc = infoRes.data.data.description;

                        resActArr[item.challengeId] = resAct;
                    })
                );
                setActiveCreatedChallengesPosts(resActArr);

                const hidCreChalRes = await axios.get(
                    "https://gunwoo.store/api/challenge/sleep/user",
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );
                setHiddenCreatedChallenges(hidCreChalRes.data.data);

                let resHidArr = {};
                await Promise.all(
                    hidCreChalRes.data.data.map(async (item) => {
                        let resHid = { data: [], desc: "" };
                        const postRes = await axios.get(
                            `https://gunwoo.store/api/posts/challenges/${item.challengeId}`
                        );
                        resHid.data = postRes.data.data.content;

                        const infoRes = await axios.get(
                            `https://gunwoo.store/api/challenge/info/${item.challengeId}`
                        );
                        resHid.desc = infoRes.data.data.description;

                        resHidArr[item.challengeId] = resHid;
                    })
                );
                setHiddenCreatedChallengesPosts(resHidArr);

                const likChalRes = await axios.get(
                    "https://gunwoo.store/api/posts/users/like",
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );				
                setLikedChallenges(likChalRes.data.data);
				console.log(likChalRes.data.data);
				
            } catch (err) {
                console.error(err);
            }
        };
        fetchChallengesData();
    }, []);

    const handlePostHover = (id) => {
        setSelectedPost(id);
    };

    const handleClickRemovePost = (event) => {
        event.stopPropagation();
        setIsRemovePostPopupVisible(true);
    };

    const handleSetPostChallengeMode = () => {
        setPostChallengeMode((prevMode) => (prevMode === "post" ? "challenge" : "post"));
    };

    const handleSetActiveSleepMode = () => {
        setActiveSleepMode((prevMode) => (prevMode === "active" ? "sleep" : "active"));
    };

	const goProfile = (profileId) => {
		setNowSelected(0);
		navigate(`/profile/${profileId}`)
	}

    return (
        <>
            {location.pathname === "/profile/my-page" && nowSelected === 0 ? (
                <div className="profilePostSortNav">
                    <div className="profilePostSortStatus">
                        {postChallengeMode === "post" ? "올린 게시물" : "참여한 챌린지"}
                    </div>
                    <div className="profilePostSortButton" onClick={handleSetPostChallengeMode}>
                        {postChallengeMode === "post" ? (
                            <IoGridOutline className="profilePostSortButtonIcon" />
                        ) : (
                            <IoGrid className="profilePostSortButtonIcon" />
                        )}
                    </div>
                </div>
            ) : nowSelected === 1 && (
                <div className="profilePostSortNav">
                    <div className="profilePostSortStatus">
                        {activeSleepMode === "active" ? "활성 챌린지" : "잠든 챌린지"}
                    </div>
                    <div className="profilePostSortButton" onClick={handleSetActiveSleepMode}>
                        {activeSleepMode === "active" ? (
                            <MdOutlineLightMode className="profilePostSortButtonIcon" />
                        ) : (
                            <MdOutlineDarkMode className="profilePostSortButtonIcon" />
                        )}
                    </div>
                </div>
            )}
            <div className="profilePosts">
                {nowSelected === 0 ? (
                    postChallengeMode === "post" ? (
                        userPostInfo ? (
                            userPostInfo.content.length > 0 ? (
                                userPostInfo.content.map((item) => (
                                    <div key={item.id} className="profilePost">
                                        <img
                                            className="profilePostThumbnail"
                                            src={item.fileType === "VIDEO" ? item.fileUrls[1] : item.fileUrls[0]}
                                            alt="썸네일"
                                        />
                                        <div className="profilePostViewCount">
                                            <IoPlay className="profilePostIcon" />
                                            {convertNumber(item.viewCount)}
                                        </div>
                                        <div
                                            className="profilePostHover"
                                            onClick={() => navigate(`/video/${item.id}`)}
                                            onMouseEnter={() => handlePostHover(item.id)}
                                        >
                                            {location.pathname === "/profile/my-page" && (
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
                                        <PostText text={`#${item.challengeInfo.title}`} type="challenge" />
                                    </div>
                                ))
                            ) : (
                                location.pathname === "/profile/my-page" && (
                                    <div className="profilePostNotFound">
                                        참여한 챌린지가 없어요 😢
                                        <div onClick={() => navigate("/search")} className="hoverBtns">
                                            참여하기
                                        </div>
                                    </div>
                                )
                            )
                        ) : (
                            <div></div>
                        )
                    ) : participatedChallenges ? (
                        participatedChallenges.length > 0 ? (
                            participatedChallenges.map((item, index) => (
                                <div key={index} className="profilePost profilePostCards">
                                    {Object.keys(participatedChallengesPosts).length > index &&
                                        participatedChallengesPosts[participatedChallenges[index].challengeId].data[0] && (
                                            <img
                                                className="profilePostThumbnail"
                                                src={
                                                    participatedChallengesPosts[
                                                        participatedChallenges[index].challengeId
                                                    ].data[0].fileType === "VIDEO"
                                                        ? participatedChallengesPosts[
                                                              participatedChallenges[index].challengeId
                                                          ].data[0].fileUrls[1]
                                                        : participatedChallengesPosts[
                                                              participatedChallenges[index].challengeId
                                                          ].data[0].fileUrls[0]
                                                }
                                                alt="썸네일"
                                            />
                                        )}
									<div
										className="profilePostCardHover"
										onClick={() => navigate(`/challenge/${item.title}`)}
									>
										<div className="profilePostParticipantCount">
											<IoPlay className="profilePostIcon" />
											{`게시물 ${item.participantCounts}개`}
										</div>
									</div>
									<div className="profilePostCard1"></div>
									<div className="profilePostCard2"></div>
                                    <PostText text={`#${item.title}`} type="title" />
                                    <PostText
                                        text={`${
                                            Object.keys(participatedChallengesPosts).length > index &&
                                            participatedChallengesPosts[
                                                participatedChallenges[index].challengeId
                                            ].desc
                                        }`}
                                        type="desc"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="profilePostNotFound">
                                참여한 챌린지가 없어요 😢
                                <div onClick={() => navigate("/search")} className="hoverBtns">
                                    참여하기
                                </div>
                            </div>
                        )
                    ) : (
                        <div></div>
                    )
                ) : nowSelected === 1 ? (
                    activeSleepMode === "active" ? (
                        activeCreatedChallenges ? (
                            activeCreatedChallenges.length > 0 ? (
                                activeCreatedChallenges.map((item, index) => (
                                    <div key={index} className="profilePost profilePostCards">
                                        {Object.keys(activeCreatedChallengesPosts).length > index &&
                                            activeCreatedChallengesPosts[activeCreatedChallenges[index].challengeId]
                                                .data[0] && (
                                                <img
                                                    className="profilePostThumbnail"
                                                    src={
                                                        activeCreatedChallengesPosts[
                                                            activeCreatedChallenges[index].challengeId
                                                        ].data[0].fileType === "VIDEO"
                                                            ? activeCreatedChallengesPosts[
                                                                  activeCreatedChallenges[index].challengeId
                                                              ].data[0].fileUrls[1]
                                                            : activeCreatedChallengesPosts[
                                                                  activeCreatedChallenges[index].challengeId
                                                              ].data[0].fileUrls[0]
                                                    }
                                                    alt="썸네일"
                                                />
                                            )}
										<div
											className="profilePostCardHover"
											onClick={() => navigate(`/challenge/${item.title}`)}
										>
											<div className="profilePostParticipantCount">
												<IoPlay className="profilePostIcon" />
												{`게시물 ${item.participantCounts}개`}
											</div>
										</div>
										<div className="profilePostCard1"></div>
										<div className="profilePostCard2"></div>

                                        <PostText text={`#${item.title}`} type="title" />
                                        <PostText
                                            text={`${
                                                Object.keys(activeCreatedChallengesPosts).length > index &&
                                                activeCreatedChallengesPosts[
                                                    activeCreatedChallenges[index].challengeId
                                                ].desc
                                            }`}
                                            type="desc"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="profilePostNotFound">
                                    챌린지를 만들어보세요 😊
                                    <div onClick={() => navigate("/new-challenge")} className="hoverBtns">
                                        만들기
                                    </div>
                                </div>
                            )
                        ) : (
                            <div></div>
                        )
                    ) : hiddenCreatedChallenges ? (
                        hiddenCreatedChallenges.length > 0 ? (
                            hiddenCreatedChallenges.map((item, index) => (
                                <div key={index} className="profilePost profilePostCards">
                                    {Object.keys(hiddenCreatedChallengesPosts).length > index &&
                                        hiddenCreatedChallengesPosts[hiddenCreatedChallenges[index].challengeId].data[0] && (
                                            <img
                                                className="profilePostThumbnail"
                                                src={
                                                    hiddenCreatedChallengesPosts[
                                                        hiddenCreatedChallenges[index].challengeId
                                                    ].data[0].fileType === "VIDEO"
                                                        ? hiddenCreatedChallengesPosts[
                                                              hiddenCreatedChallenges[index].challengeId
                                                          ].data[0].fileUrls[1]
                                                        : hiddenCreatedChallengesPosts[
                                                              hiddenCreatedChallenges[index].challengeId
                                                          ].data[0].fileUrls[0]
                                                }
                                                alt="썸네일"
                                            />
                                        )}
									<div
										className="profilePostCardHover"
										onClick={() => navigate(`/challenge/${item.title}`)}
									>
										<div className="profilePostParticipantCount">
											<IoPlay className="profilePostIcon" />
											{`게시물 ${item.participantCounts}개`}
										</div>
									</div>
									<div className="profilePostCard1"></div>
									<div className="profilePostCard2"></div>

                                    <PostText text={`#${item.title}`} type="title" />
                                    <PostText
                                        text={`${
                                            Object.keys(hiddenCreatedChallengesPosts).length > index &&
                                            hiddenCreatedChallengesPosts[hiddenCreatedChallenges[index].challengeId].desc
                                        }`}
                                        type="desc"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="profilePostNotFound">
                                잠든 챌린지가 없어요 😎
                                <div onClick={() => navigate("/new-challenge")} className="hoverBtns">
                                    만들기
                                </div>
                            </div>
                        )
                    ) : (
                        <div></div>
                    )
                ) : (
                    likedChallenges ? (
                        likedChallenges.content.length > 0 ? (
                            likedChallenges.content.map((item) => (
                                <div key={item.id} className="profilePost">
                                    <img
                                        className="profilePostThumbnail"
                                        src={item.fileType === "VIDEO" ? item.fileUrls[1] : item.fileUrls[0]}
                                        alt="썸네일"
                                    />
                                    <div className="profilePostViewCount">
                                        <IoPlay className="profilePostIcon" />
                                        {convertNumber(item.viewCount)}
                                    </div>
                                    <div
                                        className="profilePostHover"
                                        onClick={() => navigate(`/video/${item.id}`)}
                                        onMouseEnter={() => handlePostHover(item.id)}
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
										onClick={() => goProfile(item.userInfo.profileId)}
									/>
									<div className="profilePostImgName">{item.userInfo.nickname}</div>
                                    <PostText text={item.title} type="titleMini" />
                                    <PostText text={`#${item.challengeInfo.title}`} type="challengeMini" />
                                </div>
                            ))
                        ) : (
                            <div className="profilePostNotFound">
                                좋아요를 누른 게시물이 없어요 😯
                                <div onClick={() => navigate("/")} className="hoverBtns">
                                    둘러보기
                                </div>
                            </div>
                        )
                    ) : (
                        <div></div>
                    )
                )}
            </div>
        </>
    );
};

export default UserPosts;
