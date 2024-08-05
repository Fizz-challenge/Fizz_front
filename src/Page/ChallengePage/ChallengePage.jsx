import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChallengePage.css';
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaHeart, FaComment } from "react-icons/fa";
import { ImPlay2 } from "react-icons/im";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import NoticePopup from '../../Components/NoticePopup.jsx';
import Warning from '../../Components/Warning.jsx';

const SkeletonItem = () => (
  <div className="challenge-image-item">
    <Skeleton className="skeleton-image" />
    <Skeleton className="skeleton-text" />
    <Skeleton className="skeleton-text" />
    <div className="skeleton-user-info">
      <Skeleton circle className="skeleton-avatar" />
      <Skeleton className="skeleton-text" />
    </div>
  </div>
);

const SkeletonChallengeInfo = () => (
  <div className="challenge-box">
    <div className="challenge-header">
      <Skeleton className="skeleton-title" />
      <Skeleton className="skeleton-button" />
    </div>
    <div className="challenge-description">
      <Skeleton className="skeleton-description" />
      <Skeleton className="skeleton-posts" />
    </div>
  </div>
);

const ChallengePage = () => {
  const { challenge } = useParams();
  const navigate = useNavigate();
  const [challengeData, setChallengeData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const observer = useRef();

  const fetchChallengeData = async () => {
    try {
      const response = await axios.get(`https://gunwoo.store/api/challenge/info?title=${challenge}`);
      if (response.data.success === 'false' && response.data.code === 'CH001') {
        setWarningMessage("존재하지 않는 챌린지 입니다⚠️"); // 경고 메시지 업데이트
        setIsLoading(false);
        return;
      }

      setChallengeData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching challenge data:', error);
      setIsLoading(false);
    }
  };

  const fetchPosts = async (page) => {
    try {
      const response = await axios.get(`https://gunwoo.store/api/posts/challenges/${challengeData.challengeId}?page=${page}&size=8`);
      setPosts((prevPosts) => [...prevPosts, ...response.data.data.content]);
      setHasMore(response.data.data.content.length > 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setInitialLoading(false);
      fetchChallengeData();
    }, 1000);
  }, [challenge]);

  useEffect(() => {
    if (challengeData) {
      fetchPosts(page);
    }
  }, [challengeData, page]);

  const handleJoinChallenge = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsPopupVisible(true);
    } else {
      navigate(`/new-post/${challenge}`);
    }
  };

  const lastPostElementRef = useCallback((node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  if (initialLoading) {
    return (
      <div className="challenge-page">
        <div className="challenge-page-container">
          <div className="challenge-page-title">
            <div className="challenge-dates">
              <p><MdOutlineDateRange />{" "}챌린지 정보</p>
            </div>
            <SkeletonChallengeInfo />
          </div>
          <div className="challenge-image-list">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonItem key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (warningMessage) {
    return <Warning message={warningMessage} />;
  }

  return (
    <div className="challenge-page">
      <div className='challenge-page-container'>
        <div className='challenge-page-title'>
          <div className="challenge-dates">
            <p><MdOutlineDateRange />{" "}{challengeData?.isActive ? '진행중인 챌린지' : '존재하지 않는 챌린지'}</p>
          </div>
          <div className="challenge-box">
            <div className="challenge-header">
              <span>#{challengeData?.title ? `${challengeData.title}` : " "}</span>

              {challengeData?.isActive ? <>              <button onClick={handleJoinChallenge} className="join-challenge-button">
                챌린지 참여하기!
              </button></> :
                <></>}
            </div>
            <div className="challenge-description">
              <div>
                <p>{challengeData?.description}</p>
              </div>
              <div className="challenge-posts">
                <p><FaRegCirclePlay />
                  {challengeData?.participantCounts}개의 영상이 존재합니다</p>
              </div>
            </div>
          </div>
        </div>
        <div className="challenge-image-list">
          {posts.map((post, index) => {
            const imgSrc = post.fileType === "IMAGE" ? post.fileUrls[0] : post.fileUrls[1];
            const isLastElement = posts.length === index + 1;
            const postElement = (
              <div key={post.id} className="challenge-image-item" onClick={() => {navigate(`/video/${post.id}`)}}>
                <img src={imgSrc} alt={post.title} className="challenge-image-preview" />
                <div className="challenge-image-info">
                  <div className="icon"><FaHeart /><span>{post.likeCount}</span></div>
                  <div className="icon"><FaComment /><span>{post.commentCount}</span></div>
                  <div className="icon"><ImPlay2 /><span>{post.viewCount}</span></div>
                </div>
                <div className="challenge-user-info">
                  <img onClick={(e) => { 
                    e.stopPropagation(); 
                    navigate(`/profile/${post.userInfo.profileId}`); 
                  }}  src={post.userInfo.profileImage || '../src/assets/profile.jpg'} alt={post.userInfo.nickname} />
                  <p onClick={(e) => { 
                    e.stopPropagation(); 
                    navigate(`/profile/${post.userInfo.profileId}`); 
                  }}> {post.userInfo.nickname}</p>
                </div>
              </div>
            );
            return isLastElement ? <div ref={lastPostElementRef} key={post.id}>{postElement}</div> : postElement;
          })}
        </div>
      </div>
      {isPopupVisible && (
        <NoticePopup
          setIsPopupVisible={setIsPopupVisible}
          popupStatus={["로그인이 필요한 서비스입니다.", "#2DA7FF"]}
          buttonStatus={{ msg: "확인", action: () => navigate('/login') }}
        />
      )}
    </div>
  );
};

export default ChallengePage;
