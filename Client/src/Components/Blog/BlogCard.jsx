import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MessageSquare, User, Trash2, Tag, ArrowRight, Heart, X, Send } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { postService } from '../../services/api';

const BlogCard = ({ post, onDelete, onLikeUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthor = currentUser?.id === post?.userId?._id;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        // Get like count
        const likesRes = await axios.get(`${apiUrl}/likes/post/${post._id}`);
        
        let count = 0;
        if (Array.isArray(likesRes.data)) {
          count = likesRes.data.length;
        } else if (likesRes.data && typeof likesRes.data === 'object') {
          count = likesRes.data.count || likesRes.data.likesCount || 0;
        }
        setLikeCount(count);

        // Check if current user has liked the post
        if (token) {
          const likeStatusRes = await axios.get(`${apiUrl}/likes/check/${post._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsLiked(!!likeStatusRes.data?.liked);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
        setLikeCount(0);
        setIsLiked(false);
      }
    };

    fetchLikeStatus();
  }, [post._id, token, apiUrl]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.info('Please login to like posts');
      return;
    }

    try {
      setIsLoading(true);
      const wasLiked = isLiked;
      const previousCount = likeCount;
      
      const newLikeState = !wasLiked;
      setIsLiked(newLikeState);
      setLikeCount(prev => newLikeState ? prev + 1 : Math.max(0, prev - 1));
      
        const response = await axios.post(
        `${apiUrl}/likes/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // console.log('Like response:', response.data); // Debug log
      
      if (response.data) {
        if (response.data.likesCount !== undefined) {
          setLikeCount(response.data.likesCount);
        }
        if (response.data.liked !== undefined) {
          setIsLiked(response.data.liked);
        }
      }
 
      if (onLikeUpdate) {
        onLikeUpdate(post._id, newLikeState);
      }
      
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : Math.max(0, prev - 1));
      toast.error(error.response?.data?.message || 'Failed to update like');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await postService.deletePost(post._id);
      toast.success('Post deleted successfully');
      if (onDelete) {
        onDelete(post._id);
      }
      if (window.location.pathname.includes('/blog/')) {
        navigate('/blog');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/comments/post/${post._id}`);
      setComments(response.data);
      setCommentCount(response.data.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !token) return;

    try {
      setIsCommenting(true);
      await axios.post(
        `${apiUrl}/comments/add/${post._id}`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
      await fetchComments();
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await axios.delete(`${apiUrl}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchComments();
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      await fetchComments();
    }
    setShowComments(!showComments);
  };

  return (
    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-indigo-500/30 transition-all duration-300 h-full flex flex-col relative">
      {isAuthor && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
          title="Delete post"
        >
          <Trash2 size={18} />
        </button>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <div className="flex items-center mr-4">
            <User className="w-4 h-4 mr-1" />
            <span>{post?.author|| 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(post?.createdAt)}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <div 
          className="text-gray-400 mb-4 line-clamp-3 flex-grow prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.description || '') }}
        />

        {post.tags?.length > 0 && (
          <div className="mt-auto pt-4 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button 
              onClick={handleLike}
              disabled={isLoading}
              className="flex items-center text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              aria-label={isLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart 
                className={`w-5 h-5 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} 
              />
              <span className="text-sm">{likeCount}</span>
            </button>
            
            <button 
              onClick={toggleComments}
              className="flex items-center text-gray-400 hover:text-indigo-400 transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-1" />
              <span className="text-sm">{commentCount}</span>
            </button>
          </div>
          
          <Link 
            to={`/blog/${post._id}`}
            className="text-indigo-400 hover:text-indigo-300 font-medium text-sm inline-flex items-center group"
            onClick={(e) => e.stopPropagation()}
          >
            Read more
            <svg 
              className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="mb-4 space-y-4 max-h-60 overflow-y-auto pr-2">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment._id} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center text-sm text-indigo-400 font-medium">
                          {comment.commenter}
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{comment.comment}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {(currentUser?.id === comment.userId || isAuthor) && (
                        <button 
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                          aria-label="Delete comment"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">No comments yet</p>
              )}
            </div>
            
            {token && (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isCommenting}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || isCommenting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send size={16} className="mr-1" />
                  {isCommenting ? 'Posting...' : 'Post'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;