import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFire, FaHeart, FaComment, FaArrowLeft } from "react-icons/fa";

interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  likedBy: string[];
}

const TopPosts: React.FC = () => {
  const navigate = useNavigate();
  const [topPosts, setTopPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/idea/toppost");
        const data = await res.json();
        setTopPosts(data);
      } catch (error) {
        console.error("Failed to fetch top posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  const PostSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/homepage")}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <FaFire className="h-5 w-5 text-orange-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Trending Posts</h1>
              </div>
            </div>
            <span className="text-sm text-gray-500">Top {topPosts.length} posts</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white p-8 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FaFire className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Most Liked Ideas</h1>
              <p className="text-orange-100">Discover the community's favorite innovations</p>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))
          ) : topPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <FaFire className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trending posts yet</h3>
              <p className="text-gray-500">Be the first to create a viral idea!</p>
            </div>
          ) : (
            topPosts.map((post, index) => (
              <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Ranking Badge */}
                <div className="relative">
                  <div className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                    #{index + 1}
                  </div>
                  
                  <div className="pt-6 pb-4 px-6">
                    <div className="ml-12">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-orange-100 rounded-full">
                            <FaFire className="h-3 w-3 text-orange-600" />
                          </div>
                          <span className="text-sm font-medium text-orange-600">Trending</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FaHeart className="h-4 w-4 text-red-500" />
                            <span>{post.likedBy.length} likes</span>
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                      <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
                      
                      {post.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full max-h-64 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2 text-red-600">
                            <FaHeart className="h-4 w-4" />
                            <span className="font-medium text-sm">{post.likedBy.length}</span>
                          </div>
                          <button 
                            onClick={() => navigate(`/comment/${post._id}`)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            <FaComment className="h-4 w-4" />
                            <span className="font-medium text-sm">Comments</span>
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => navigate(`/comment/${post._id}`)}
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TopPosts;
