import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Comment.css';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';
import timeSince from './utils.jsx';
import NoticePopup from '../../Components/NoticePopup.jsx';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [visibleReplies, setVisibleReplies] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const token = localStorage.getItem('accessToken');
  const profileId = localStorage.getItem('profileId');
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://gunwoo.store/api/comment/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedComments = await Promise.all(response.data.data.map(async comment => {
        if (token) {
          const likeResponse = await axios.get(`https://gunwoo.store/api/comment/${comment.commentId}/like`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return {
            id: comment.commentId,
            parentId: comment.parentId,
            user: comment.nickname,
            avatar: comment.profileImage,
            text: comment.content,
            date: comment.createdAt,
            replies: [],
            profileId: comment.profileId,
            likeCount: comment.likeCount,
            childCount: comment.childCount,
            isLike: likeResponse.data.data.isLike
          };
        } else {
          return {
            id: comment.commentId,
            parentId: comment.parentId,
            user: comment.nickname,
            avatar: comment.profileImage,
            text: comment.content,
            date: comment.createdAt,
            replies: [],
            profileId: comment.profileId,
            likeCount: comment.likeCount,
            childCount: comment.childCount,
            isLike: false
          };
        }
      }));
      const rootComments = fetchedComments.filter(comment => !comment.parentId);
      setComments(rootComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchReplies = async (commentId) => {
    if (!token) {
      setIsPopupVisible(true);
      return;
    }
    try {
      const response = await axios.get(`https://gunwoo.store/api/comment/post/${commentId}/reply`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedReplies = await Promise.all(response.data.data.map(async reply => {
        const likeResponse = await axios.get(`https://gunwoo.store/api/comment/${reply.commentId}/like`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return {
          id: reply.commentId,
          parentId: reply.parentId,
          user: reply.nickname,
          avatar: reply.profileImage,
          text: reply.content,
          date: reply.createdAt,
          profileId: reply.profileId,
          likeCount: reply.likeCount,
          isLike: likeResponse.data.data.isLike
        };
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
    if (!token) {
      setIsPopupVisible(true);
      return;
    }
    if (replyTo === commentId) {
      setReplyTo(null);
    } else {
      setReplyTo(commentId);
      setReplyText('');
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) {
      return;
    }
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
    if (!token) {
      setIsPopupVisible(true);
      return;
    }
    if (!newCommentText.trim()) {
      return;
    }
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
      fetchComments();
      setNewCommentText('');
    } catch (error) {
      console.error("Error submitting comment:", error);
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

  const handleEditClick = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditText(currentText);
  };

  const handleEditSubmit = async (commentId) => {
    if (!editText.trim()) {
      return;
    }
    try {
      await axios.put(`https://gunwoo.store/api/comment/post/${commentId}`,
        {
          content: editText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchComments();
      setEditingCommentId(null);
      setEditText('');
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteClick = async (commentId, parentId) => {
    try {
      const response = await axios.delete(`https://gunwoo.store/api/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        if (parentId === null) {
          fetchComments();
        } else {
          fetchComments();
          fetchReplies(parentId);
        }
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLikeClick = async (commentId, isLike) => {
    if (!token) {
      setIsPopupVisible(true);
      return;
    }
    try {
      if (isLike) {
        const response = await axios.delete(`https://gunwoo.store/api/comment/${commentId}/like`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setComments(prevComments => prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                isLike: false,
                likeCount: comment.likeCount - 1
              };
            }
            return comment;
          }));
        }
      } else {
        const response = await axios.post(`https://gunwoo.store/api/comment/${commentId}/like`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setComments(prevComments => prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                isLike: true,
                likeCount: comment.likeCount + 1
              };
            }
            return comment;
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleReplyLikeClick = async (commentId, isLike, parentId) => {
    if (!token) {
      setIsPopupVisible(true);
      return;
    }
    setComments(prevComments => prevComments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                isLike: !isLike,
                likeCount: isLike ? reply.likeCount - 1 : reply.likeCount + 1
              };
            }
            return reply;
          })
        };
      }
      return comment;
    }));

    try {
      if (isLike) {
        await axios.delete(`https://gunwoo.store/api/comment/${commentId}/like`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`https://gunwoo.store/api/comment/${commentId}/like`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setComments(prevComments => prevComments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLike: isLike,
                  likeCount: isLike ? reply.likeCount + 1 : reply.likeCount - 1
                };
              }
              return reply;
            })
          };
        }
        return comment;
      }));
    }
  };

  const handleKeyPress = (event, commentId) => {
    if (event.key === 'Enter') {
      if (commentId) {
        handleReplySubmit(commentId);
      } else {
        handleNewCommentSubmit();
      }
    }
  };

  const renderComments = (comments, isChild = false) => {
    return comments.map(comment => (
      <div key={comment.id} className={`comment ${isChild ? 'child-comment' : ''}`}>
        <div className="comment-header">
          <div className="comment-user-avatar">
            <img onClick={() => { navigate(`/profile/${comment.profileId}`)}} src={comment.avatar || '../src/assets/profile.jpg'} alt={`${comment.user}'s avatar`} />
          </div>
          <div className="comment-user-details">
            <p className="comment-user-name" onClick={() => { navigate(`/profile/${comment.profileId}`)}}><strong>{comment.user}</strong></p>
            <p className="comment-text">{comment.text}</p>
            <div className="comment-meta">
              <p className="comment-date">{timeSince(comment.date)}</p>
              {!isChild && (
                <span className="reply-link" onClick={() => handleReplyClick(comment.id)}>답글</span>
              )}
            </div>
          </div>
          {comment.user === profileId && (
            <div className='comment-actions'>
              <FiMoreHorizontal />
              <div className="comment-actions-menu">
                <div className='comment-actions-buttons'>
                  <button title="수정" onClick={() => handleEditClick(comment.id, comment.text)}><FaEdit /></button>
                  <button title="삭제" onClick={() => handleDeleteClick(comment.id, comment.parentId)}><FaTrash /></button>
                </div>
              </div>
            </div>
          )}
          <div className='comment-like-section'>
            {comment.isLike ? (
              <FaHeart onClick={() => isChild ? handleReplyLikeClick(comment.id, true, comment.parentId) : handleLikeClick(comment.id, true)} />
            ) : (
              <FaRegHeart onClick={() => isChild ? handleReplyLikeClick(comment.id, false, comment.parentId) : handleLikeClick(comment.id, false)} />
            )}
            <div className="like-count">{comment.likeCount}</div>
          </div>
        </div>
        {!isChild && comment.childCount > 0 && (
          <>
            <span className="toggle-replies-link" onClick={() => toggleRepliesVisibility(comment.id)}>
              답글 {comment.childCount}개 보기
            </span>
            {visibleReplies[comment.id] && (
              <div className="replies">
                {renderComments(comment.replies, true)}
              </div>
            )}
          </>
        )}
        {replyTo === comment.id && (
          <div className="reply-section">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답글을 작성해주세요"
              onKeyPress={(e) => handleKeyPress(e, comment.id)}
            />
            <button
              onClick={() => handleReplySubmit(comment.id)}
              className="reply-submit-button"
              disabled={!replyText.trim()}
            >
              답글
            </button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
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
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleNewCommentSubmit}
            className="reply-submit-button"
            disabled={!newCommentText.trim()}
          >
            댓글
          </button>
        </div>
      </div>
      {isPopupVisible && (
        <NoticePopup
          setIsPopupVisible={setIsPopupVisible}
          popupStatus={["로그인이 필요한 서비스입니다.", "#2DA7FF"]}
          buttonStatus={{ msg: "확인", action: () => navigate('/login') }}
        />
      )}
    </>
  );
};

export default CommentSection;
