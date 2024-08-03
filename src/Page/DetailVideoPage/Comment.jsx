import React, { useEffect, useState } from 'react';
import './Comment.css';
import { LuHeart } from "react-icons/lu";
import axios from 'axios';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [visibleReplies, setVisibleReplies] = useState({});

  const token = localStorage.getItem('accessToken');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://gunwoo.store/api/comment/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedComments = response.data.data.map(comment => ({
        id: comment.commentId,
        parentId: comment.parentId,
        user: comment.nickname,
        avatar: '/img/test.jpg',
        text: comment.content,
        date: new Date().toISOString().split('T')[0], 
        replies: [],
        likeCount: comment.likeCount,
        childCount: comment.childCount
      }));
      const rootComments = fetchedComments.filter(comment => !comment.parentId);
      setComments(rootComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      const response = await axios.get(`https://gunwoo.store/api/comment/post/${commentId}/reply`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedReplies = response.data.data.map(reply => ({
        id: reply.commentId,
        parentId: reply.parentId,
        user: reply.nickname,
        avatar: '/img/test.jpg',
        text: reply.content,
        date: new Date().toISOString().split('T')[0],
        likeCount: reply.likeCount
      }));
      setComments(prevComments => {
        const updatedComments = prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: fetchedReplies
            };
          }
          return comment;
        });
        return updatedComments;
      });
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleReplyClick = (commentId) => {
    if (replyTo === commentId) {
      setReplyTo(null);
    } else {
      setReplyTo(commentId);
      setReplyText('');
    }
  };

  const handleReplySubmit = async (commentId) => {
    try {
      await axios.post(`https://gunwoo.store/api/comment/post/${postId}/reply`, 
        {
          parentCommentId: commentId,
          content: replyText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchComments();
      setReplyTo(null);
      setReplyText('');
    } catch (error) {
      console.error("Error submitting reply:", error);
      console.log(commentId);
    }
  };

  const handleNewCommentSubmit = async () => {
    if (newCommentText.trim()) {
      try {
        await axios.post(`https://gunwoo.store/api/comment/post/${postId}`, 
          {
            content: newCommentText
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        fetchComments(); // 댓글을 다시 가져와서 업데이트
        setNewCommentText('');
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  const toggleRepliesVisibility = (commentId) => {
    if (visibleReplies[commentId]) {
      setVisibleReplies(prevState => ({
        ...prevState,
        [commentId]: false
      }));
    } else {
      fetchReplies(commentId);
      setVisibleReplies(prevState => ({
        ...prevState,
        [commentId]: true
      }));
    }
  };

  const renderComments = (comments) => {
    return comments.map(comment => (
      <div key={comment.id} className="comment">
        <div className="comment-header">
          <div className="comment-user-avatar">
            <img src={comment.avatar} alt={`${comment.user}'s avatar`} />
          </div>
          <div className="comment-user-details">
            <p className="comment-user-name"><strong>{comment.user}</strong></p>
            <p className="comment-text">{comment.text}</p>
            <div className="comment-meta">
              <p className="comment-date">{comment.date}</p>
              {comment.parentId === null && (
                <span className="reply-link" onClick={() => handleReplyClick(comment.id)}>답글</span>
              )}
            </div>
            {replyTo === comment.id && (
              <div className="reply-section">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="답글을 작성해주세요"
                />
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  className="reply-submit-button"
                >
                  답글
                </button>
              </div>
            )}
          </div>
          <div className='comment-like-section'>
            <LuHeart />
            <div className="like-count">{comment.likeCount}</div>
          </div>
        </div>
        {comment.parentId === null && comment.childCount > 0 && (
          <>
            <span className="toggle-replies-link" onClick={() => toggleRepliesVisibility(comment.id)}>
              답글 {comment.childCount}개 보기
            </span>
            {visibleReplies[comment.id] && (
              <div className="replies">
                {renderComments(comment.replies)}
              </div>
            )}
          </>
        )}
      </div>
    ));
  };

  return (
    <div className="comment-section">
      <h2>댓글</h2>
      <div className="comments">
        {renderComments(comments)}
      </div>
      <div className="new-comment-section">
        <input
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="댓글을 작성해주세요"
        />
        <button
          onClick={handleNewCommentSubmit}
          className="reply-submit-button"
        >
          댓글 달기
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
