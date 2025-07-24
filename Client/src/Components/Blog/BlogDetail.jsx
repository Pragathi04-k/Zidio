import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, Heart, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthor = currentUser?.id === post?.userId?._id;

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        const [postRes, likesRes] = await Promise.all([
          axios.get(`${apiUrl}/posts/${id}`),
          axios.get(`${apiUrl}/likes/post/${id}`)
        ]);
        
        setPost(postRes.data);
        
        // Handle like count
        let count = 0;
        if (Array.isArray(likesRes.data)) {
          count = likesRes.data.length;
        } else if (likesRes.data && typeof likesRes.data === 'object') {
          count = likesRes.data.count || likesRes.data.likesCount || 0;
        }
        setLikeCount(count);

        // Check if current user has liked the post
        if (token) {
          const likeStatusRes = await axios.get(`${apiUrl}/likes/check/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsLiked(!!likeStatusRes.data?.liked);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast.error('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, token, apiUrl]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.info('Please login to like posts');
      return;
    }

    try {
      setIsLikeLoading(true);
      const wasLiked = isLiked;
      const newLikeState = !wasLiked;
      
      // Optimistic update
      setIsLiked(newLikeState);
      setLikeCount(prev => newLikeState ? prev + 1 : Math.max(0, prev - 1));
      
      const response = await axios.post(
        `${apiUrl}/likes/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update with actual data from the server
      if (response.data) {
        if (response.data.likesCount !== undefined) {
          setLikeCount(response.data.likesCount);
        }
        if (response.data.liked !== undefined) {
          setIsLiked(response.data.liked);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : Math.max(0, prev - 1));
      toast.error(error.response?.data?.message || 'Failed to update like');
    } finally {
      setIsLikeLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Link 
            to="/blog" 
            className="text-indigo-400 hover:text-indigo-300 inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/blog" 
            className="text-indigo-400 hover:text-indigo-300 inline-flex items-center mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to blog
          </Link>
          
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <div className="flex items-center mr-6">
              <User className="w-4 h-4 mr-1" />
              <span>{post?.author || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(post?.createdAt)}</span>
            </div>
            <div className="ml-6 flex items-center">
              <button 
                onClick={handleLike}
                disabled={isLikeLoading}
                className="flex items-center text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                aria-label={isLiked ? 'Unlike post' : 'Like post'}
              >
                <Heart 
                  className={`w-5 h-5 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} 
                />
                <span>{likeCount}</span>
              </button>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
          
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
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
          )}
        </div>
        
        <div 
          className="prose prose-invert max-w-none bg-gray-800/30 p-6 rounded-lg"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.description || '') }}
        />
        
        <div className="mt-12 pt-6 border-t border-gray-800 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {post.updatedAt !== post.createdAt ? (
              <span>Last updated on {formatDate(post.updatedAt)}</span>
            ) : (
              <span>Posted on {formatDate(post.createdAt)}</span>
            )}
          </div>
          
          <button 
            onClick={handleLike}
            disabled={isLikeLoading}
            className="flex items-center px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full hover:bg-indigo-500/20 transition-colors"
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            <Heart 
              className={`w-5 h-5 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} 
            />
            <span>{isLiked ? 'Liked' : 'Like this post'}</span>
            <span className="ml-2 bg-gray-800/50 px-2 py-0.5 rounded-full text-xs">
              {likeCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
