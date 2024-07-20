import React from 'react';
import './Comment.css';

const CommentSection = ({ comments }) => {
  return (
    <div className="comment-section">
      <h2>댓글</h2>
      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.user}</strong>: {comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
