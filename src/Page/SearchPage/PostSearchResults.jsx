import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPlay } from "react-icons/io5";
import { FaComment, FaHeart } from "react-icons/fa6";
import PostText from "../UserPage/PostText.jsx";
import styles from "./PostSearchResults.module.css";

const PostSearchResults = ({ filteredPosts }) => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostHover = (id) => {
    setSelectedPost(id);
  };

  const getThumbnail = (post) => {
    return post.fileType === "VIDEO" ? post.fileUrls[1] : post.fileUrls[0];
  };

  return (
    <div className={styles.postsContainer}>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div
            key={post.id}
            className={styles.postCard}
            onClick={() => navigate(`/video/${post.id}`)}
          >
            <img className={styles.postThumbnail} src={getThumbnail(post)} alt="썸네일" />
            <div className={styles.postDetails}>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postContent}>#{post.challengeInfo.title}</div>
              <div className={styles.postStats}>
                <div className={styles.postInfo}>
                  <IoPlay className={styles.postIcon} />
                  {post.viewCount}
                </div>
                <div className={styles.postInfo}>
                  <FaHeart className={styles.postIcon} />
                  {post.likeCount}
                </div>
                <div className={styles.postInfo}>
                  <FaComment className={styles.postIcon} />
                  {post.commentCount}
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
