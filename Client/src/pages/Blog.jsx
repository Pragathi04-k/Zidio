import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import BlogCard from '../Components/Blog/BlogCard';
import Footer from '../Components/Footer';

// Mock data - Replace this with your actual API call
const mockPosts = [
  {
    _id: '1',
    title: 'Getting Started with React',
    description: 'Learn the basics of React and how to build your first application with this comprehensive guide.',
    tags: ['React', 'JavaScript', 'Frontend'],
    userId: { username: 'johndoe' },
    createdAt: '2025-07-20T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Advanced Node.js Patterns',
    description: 'Explore advanced patterns and best practices for building scalable Node.js applications.',
    tags: ['Node.js', 'Backend', 'JavaScript'],
    userId: { username: 'janedoe' },
    createdAt: '2025-07-15T14:30:00Z'
  },
  {
    _id: '3',
    title: 'Mastering CSS Grid',
    description: 'A deep dive into CSS Grid and how to create complex layouts with ease.',
    tags: ['CSS', 'Frontend', 'Design'],
    userId: { username: 'alice' },
    createdAt: '2025-07-10T09:15:00Z'
  },
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, you would fetch posts from your API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/posts');
        // const data = await response.json();
        // setFilteredPosts(data);
        
        // Using mock data for now
        setFilteredPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredPosts(mockPosts);
      return;
    }

    const filtered = mockPosts.filter(post => 
      post.title.toLowerCase().includes(term) ||
      post.userId.username.toLowerCase().includes(term) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );

    setFilteredPosts(filtered);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredPosts(mockPosts);
  };

  return (
    <>
    <div className="min-h-screen w-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Latest Blog Posts
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by title, author, or tag..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
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
    <Footer/>
    </>
  );
};

export default Blog;