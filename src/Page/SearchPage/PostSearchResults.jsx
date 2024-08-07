import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPlay } from "react-icons/io5";
import { FaComment, FaHeart } from "react-icons/fa6";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from "./PostSearchResults.module.css";

const PostSearchResults = ({ filteredPosts, loading }) => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handlePostHover = (id) => {
    setSelectedPost(id);
  };

  const getThumbnail = (post) => {
    return post.fileType === "VIDEO" ? post.fileUrls[1] : post.fileUrls[0];
  };

  if (loading || showSkeleton) {
    return (
      <div className={styles.postsContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <Skeleton width={250} height={320} borderRadius={15} />
            <div className={styles.skeletonProfile}>
              <Skeleton circle={true} width={40} height={40} />
              <div className={styles.skeletonText}>
                <Skeleton width={170} height={20} />
                <Skeleton width={100} height={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.postsContainer}>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div
            key={post.id}
            className={styles.postCard}
            onMouseEnter={() => handlePostHover(post.id)}
            onMouseLeave={() => handlePostHover(null)}
            onClick={() => navigate(`/video/${post.id}`)}
          >
            <div className={styles.thumbnailWrapper}>
              <img className={styles.postThumbnail} src={getThumbnail(post)} alt="썸네일" />
              <div className={styles.overlay}></div>
              <div className={styles.postViewCount}>
                <IoPlay className={styles.postIcon} />
                {post.viewCount}
              </div>
              {selectedPost === post.id && (
                <div className={styles.postHoverInfo}>
                  <div className={styles.postInfo}>
                    <FaHeart className={styles.postIcon} />
                    {post.likeCount}
                  </div>
                  <div className={styles.postInfo}>
                    <FaComment className={styles.postIcon} />
                    {post.commentCount}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.postDetails}>
              <img
                className={styles.postProfileImage}
                src={post.userInfo.profileImage ? post.userInfo.profileImage : "../src/assets/profile.jpg"}
                alt="프로필 이미지"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${post.userInfo.profileId}`);
                }}
              />
              <div className={styles.postTextContainer}>
                <div className={styles.postTitle}>{post.title}</div>
                <div
                  className={styles.postChallenge}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/challenge/${post.challengeInfo.title}`);
                  }}
                >
                  {`#${post.challengeInfo.title}`}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.notFound}>게시글을 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default PostSearchResults;
