import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPlay } from "react-icons/io5";
import { FaComment, FaHeart } from "react-icons/fa6";
import PostText from "../UserPage/PostText.jsx";
import "./PostSearchResults.css";

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
    <div className="searchPosts-container">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div key={post.id} className="searchPost">
            <img className="searchPostThumbnail" src={getThumbnail(post)} alt="썸네일" />
            <div className="searchPostViewCount">
              <IoPlay className="searchPostIcon" />
              {post.viewCount}
            </div>
            <div
              className="searchPostHover"
              onClick={() => navigate(`/video/${post.id}`)}
              onMouseEnter={() => handlePostHover(post.id)}
            >
              <div className="searchPostLikeCount">
                <FaHeart className="searchPostIcon" />
                {post.likeCount}
              </div>
              <div className="searchPostCommentCount">
                <FaComment className="searchPostIcon" />
                {post.commentCount}
              </div>
            </div>
            <PostText text={post.title} type="title" />
            <PostText text={`#${post.challengeInfo.title}`} type="challenge" />
          </div>
        ))
      ) : (
        <p>게시글을 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default PostSearchResults;
