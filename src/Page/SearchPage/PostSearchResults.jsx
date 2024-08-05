import React from 'react';

const PostSearchResults = ({ filteredPosts = [] }) => {
  return filteredPosts.length > 0 ? (
    <div className="posts-container">
      {filteredPosts.map((post) => (
        <div key={post.id} className="post-card">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>{`작성자: ${post.userInfo.nickname}`}</p>
          <p>{`조회수: ${post.viewCount} 댓글수: ${post.commentCount} 좋아요: ${post.likeCount}`}</p>
          <p>{`챌린지: ${post.challengeInfo.title}`}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>게시글을 찾을 수 없습니다.</p>
  );
};

export default PostSearchResults;
