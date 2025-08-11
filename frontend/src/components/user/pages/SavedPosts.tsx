import React, { useEffect, useState } from "react";
import {
  FaComment,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface SavedPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  like?: number;
  userId: { _id: string; name: string };
  createdAt?: string;
  comments?: number;
  savedBy?: string[];
}

const SavedPosts: React.FC = () => {
  const navigate = useNavigate();
  const [, setUserName] = useState("");
  const [, setUserAvatar] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [selectedPost, setSelectedPost] = useState<SavedPost | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchSavedPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check authentication
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(storedUser);
        setUserName(user.name);
        setCurrentUserId(user._id);
        setUserAvatar(
          user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=6366f1&color=fff`
        );

        // Fetch saved posts
        await fetchSavedPosts(user._id);
      } catch (error) {
        console.error("Error in initialization:", error);
        setError("Failed to initialize. Please try again.");
        setLoading(false);
      }
    };

    checkAuthAndFetchSavedPosts();
  }, [navigate]);

  const fetchSavedPosts = async (userId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/idea/ideas");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allPosts = await response.json();

      // Filter posts that are saved by current user
      const userSavedPosts = allPosts.filter(
        (post: SavedPost) => post.savedBy && post.savedBy.includes(userId)
      );

      setSavedPosts(userSavedPosts);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      setError("Failed to load saved posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = (id: string) => {
    navigate(`/comment/${id}`);
  };

  const handleLike = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like posts");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/review/like/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setSavedPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id ? { ...post, like: data.like } : post
        )
      );
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error liking post:", error);
      alert(
        `Failed to like post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleUnsave = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to manage saved posts");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/review/save/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ savePost: false }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Remove from saved posts list
      setSavedPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      alert("Post removed from saved posts!");
    } catch (error) {
      console.error("Error removing saved post:", error);
      alert(
        `Failed to remove saved post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const openPostModal = (post: SavedPost) => {
    setSelectedPost(post);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closePostModal = () => {
    setSelectedPost(null);
    setShowModal(false);
    document.body.style.overflow = "unset";
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      technology: "bg-blue-100 text-blue-800",
      lifestyle: "bg-green-100 text-green-800",
      business: "bg-purple-100 text-purple-800",
      education: "bg-yellow-100 text-yellow-800",
      health: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  const PostSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  // Error UI component
  const ErrorDisplay = ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <div className="text-8xl mb-6">⚠️</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-500 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
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
                <div className="p-2 bg-yellow-100 rounded-full">
                  <FaBookmark className="h-5 w-5 text-yellow-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Saved Posts</h1>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {savedPosts.length} saved posts
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl text-white p-8 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FaBookmark className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Your Saved Ideas</h1>
              <p className="text-yellow-100">
                Ideas you've bookmarked for later reading
              </p>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))
          ) : error ? (
            <ErrorDisplay
              message={error}
              onRetry={() => currentUserId && fetchSavedPosts(currentUserId)}
            />
          ) : savedPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <FaBookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No saved posts yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start bookmarking interesting ideas to read them later!
              </p>
              <button
                onClick={() => navigate("/homepage")}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Ideas
              </button>
            </div>
          ) : (
            savedPosts.map((post) => (
              <article
                key={post._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        post.userId.name || "User"
                      )}&background=6366f1&color=fff`}
                      alt={post.userId.name}
                      className="h-12 w-12 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {post.userId.name || "Unknown"}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{formatTimeAgo(post.createdAt || "")}</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            post.category
                          )}`}
                        >
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                    <FaEllipsisH className="h-4 w-4" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:5000/${post.image}`}
                        alt={post.title}
                        className="w-full max-h-48 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => openPostModal(post)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    Read Full Post →
                  </button>
                </div>

                {/* Post Actions */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all ${
                          likedPosts.has(post._id)
                            ? "text-red-600 bg-red-50 hover:bg-red-100"
                            : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {likedPosts.has(post._id) ? (
                          <FaHeart className="h-4 w-4" />
                        ) : (
                          <FaRegHeart className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm">
                          {post.like ?? 0}
                        </span>
                      </button>

                      <button
                        onClick={() => handleComment(post._id)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <FaComment className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          {post.comments ?? 0}
                        </span>
                      </button>

                      <button className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all">
                        <FaShare className="h-4 w-4" />
                        <span className="font-medium text-sm">Share</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleUnsave(post._id)}
                      className="p-2 rounded-full text-yellow-600 bg-yellow-50 hover:bg-yellow-100 transition-all"
                      title="Remove from saved posts"
                    >
                      <FaBookmark className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/30 to-red-500/20 backdrop-blur-md"
            onClick={closePostModal}
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200/50">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedPost.userId.name || "User"
                    )}&background=6366f1&color=fff`}
                    alt={selectedPost.userId.name}
                    className="h-12 w-12 rounded-full border-2 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedPost.userId.name || "Unknown"}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{formatTimeAgo(selectedPost.createdAt || "")}</span>
                      <span>•</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          selectedPost.category
                        )}`}
                      >
                        {selectedPost.category}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closePostModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-full transition-all duration-200 shadow-sm"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] bg-gradient-to-br from-white via-gray-50/30 to-yellow-50/20">
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                  {selectedPost.title}
                </h1>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 mb-6">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {selectedPost.description}
                  </p>
                </div>

                {selectedPost.image && (
                  <div className="mb-8">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm p-2">
                      <img
                        src={`http://localhost:5000/${selectedPost.image}`}
                        alt={selectedPost.title}
                        className="w-full max-h-96 object-cover rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(selectedPost._id)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-full transition-all shadow-sm ${
                          likedPosts.has(selectedPost._id)
                            ? "text-red-600 bg-red-50 hover:bg-red-100 shadow-red-100"
                            : "text-gray-600 hover:text-red-600 hover:bg-red-50 bg-white hover:shadow-red-100"
                        }`}
                      >
                        {likedPosts.has(selectedPost._id) ? (
                          <FaHeart className="h-5 w-5" />
                        ) : (
                          <FaRegHeart className="h-5 w-5" />
                        )}
                        <span className="font-medium text-lg">
                          {selectedPost.like ?? 0}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          closePostModal();
                          handleComment(selectedPost._id);
                        }}
                        className="flex items-center space-x-2 px-4 py-3 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-white transition-all shadow-sm hover:shadow-blue-100"
                      >
                        <FaComment className="h-5 w-5" />
                        <span className="font-medium text-lg">
                          {selectedPost.comments ?? 0}
                        </span>
                      </button>

                      <button className="flex items-center space-x-2 px-4 py-3 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 bg-white transition-all shadow-sm hover:shadow-green-100">
                        <FaShare className="h-5 w-5" />
                        <span className="font-medium text-lg">Share</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleUnsave(selectedPost._id)}
                      className="p-3 rounded-full text-yellow-600 bg-yellow-50 hover:bg-yellow-100 shadow-yellow-100 transition-all shadow-sm"
                      title="Remove from saved posts"
                    >
                      <FaBookmark className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPosts;

