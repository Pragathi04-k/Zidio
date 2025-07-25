import React, { useState, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BlogCard from '../Components/Blog/BlogCard';
import { postService } from '../services/api';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await postService.getPosts();
      setAllPosts(response.posts);
      setFilteredPosts(response.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostDelete = (deletedPostId) => {
    setFilteredPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setFilteredPosts(allPosts);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) || 
      (post.content && post.content.toLowerCase().includes(searchLower)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
      (post.author && typeof post.author === 'object' && 
        (post.author.username?.toLowerCase().includes(searchLower) ||
         post.author.fullName?.toLowerCase().includes(searchLower)))
    );
    
    setFilteredPosts(filtered);
    
    if (filtered.length === 0) {
      toast('No matching posts found', { icon: '🔍' });
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredPosts(allPosts);
  };

  const navigate = useNavigate();

  const handleCreateNewPost = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please log in to create a new post');
      navigate('/login');
      return;
    }
    navigate('/blog/new');
  };
// console.log(filteredPosts);
  return (
    <>
      <div className="min-h-screen w-full mt-10 bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
              Latest Blog Posts
            </h1>
            <button
              onClick={handleCreateNewPost}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Post</span>
            </button>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title, author, or tag..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
          </form>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard 
                  key={post._id} 
                  post={post} 
                  onDelete={handlePostDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-400">No posts found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;