import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, User } from 'lucide-react';

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-indigo-500/30 transition-all duration-300 h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <div className="flex items-center mr-4">
            <User className="w-4 h-4 mr-1" />
            <span>{post?.userId?.username || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(post?.createdAt)}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-400 mb-4 line-clamp-3 flex-grow">
          {post.description}
        </p>

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
      
      <div className="px-6 pb-6 pt-2">
        <Link 
          to={`/blog/${post._id}`}
          className="text-indigo-400 hover:text-indigo-300 font-medium text-sm inline-flex items-center group"
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
    </div>
  );
};

export default BlogCard;