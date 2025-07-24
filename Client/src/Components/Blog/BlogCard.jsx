import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MessageSquare, User, Trash2, Tag, ArrowRight, Heart } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import postService from '../../services/api';

const BlogCard = ({ post, onDelete, onLikeUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  // console.log(post);
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthor = currentUser?.id === post?.userId?._id;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        // Get like count
        const likesRes = await axios.get(`${apiUrl}/likes/post/${post._id}`);
        // console.log('Likes response:', likesRes.data); // Debug log
        
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
          // console.log('Like status response:', likeStatusRes.data); // Debug log
          setIsLiked(!!likeStatusRes.data?.liked);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
        // Set default values in case of error
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
      
      <div className="px-6 pb-6 pt-2 flex justify-between items-center">
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
      </div>
    </div>
  );
};

export default BlogCard;