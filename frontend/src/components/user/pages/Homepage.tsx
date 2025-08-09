import React, { useEffect, useState } from "react";
import {
  FaComment,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
  FaPlus,
  FaFire,
  FaUser,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Idea {
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

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [, setCurrentUserId] = useState("");
  const [posts, setPosts] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [selectedPost, setSelectedPost] = useState<Idea | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        navigate("/login");
        return false;
      }

      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
        setCurrentUserId(user._id);
        setUserAvatar(
          user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=6366f1&color=fff`
        );
        return true;
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
        return false;
      }
    };

    if (checkAuth()) {
      fetchIdeas();
    }
  }, [navigate]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/idea/ideas");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);

      // Initialize saved posts from backend data
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userSavedPosts = new Set<string>();
        data.forEach((post: Idea) => {
          if (post.savedBy && post.savedBy.includes(user._id)) {
            userSavedPosts.add(post._id);
          }
        });
        setSavedPosts(userSavedPosts);
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
      setError("Failed to load posts. Please try again.");
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
      setPosts((prevPosts) =>
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

  // Enhanced save function with proper error handling
  const handleSave = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save posts");
      navigate("/login");
      return;
    }

    const isCurrentlySaved = savedPosts.has(id);

    try {
      const response = await fetch(
        `http://localhost:5000/api/review/save/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ savePost: !isCurrentlySaved }),
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

      const data = await response.json();

      // Update local state
      setSavedPosts((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlySaved) {
          newSet.delete(id);
          alert("Post removed from saved posts!");
        } else {
          newSet.add(id);
          // alert("Post saved successfully!");
        }
        return newSet;
      });

      // Update posts with new saved data if provided
      if (data.idea && data.idea.savedBy) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === id ? { ...post, savedBy: data.idea.savedBy } : post
          )
        );
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert(
        `Failed to ${isCurrentlySaved ? "unsave" : "save"} post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const openPostModal = (post: Idea) => {
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

  const getTwoLineDescription = (description: string) => {
    if (description.length <= 120) return description;
    return description.substring(0, 120) + "...";
  };

  const needsTruncation = (description: string) => {
    return description.length > 120;
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
    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="text-8xl mb-6">⚠️</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h3>
      <p className="text-gray-500 text-lg mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        <span>Try Again</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <div className="text-center mb-6">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-20 w-20 rounded-full mx-auto mb-4 border-4 border-indigo-100"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  {userName}
                </h3>
                <p className="text-sm text-gray-500">Idea Contributor</p>
                <div className="mt-3 px-3 py-1 bg-indigo-50 rounded-full">
                  <span className="text-xs text-indigo-600 font-medium">
                    Active Member
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/toppost")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <FaFire className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Trending Posts</span>
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <FaUser className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">My Profile</span>
                </button>
                <button
                  onClick={() => navigate("/savedpost")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <FaBookmark className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">Saved Posts</span>
                  {savedPosts.size > 0 && (
                    <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
                      {savedPosts.size}
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/create")}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FaPlus className="h-4 w-4" />
                  <span className="font-medium">Share New Idea</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white p-8 mb-8 relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-indigo-100 text-lg mb-4">
                  Ready to discover amazing ideas from our innovative community?
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <span>💡</span>
                    <span>{posts.length} Ideas Shared</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <span>🔖</span>
                    <span>{savedPosts.size} Saved Posts</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <span>🌟</span>
                    <span>Community Driven</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-32 w-32 bg-white/5 rounded-full"></div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))
              ) : error ? (
                <ErrorDisplay message={error} onRetry={fetchIdeas} />
              ) : posts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="text-8xl mb-6">💡</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No ideas yet
                  </h3>
                  <p className="text-gray-500 text-lg mb-6">
                    Be the first to share your brilliant idea with the
                    community!
                  </p>
                  <button
                    onClick={() => navigate("/create")}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <FaPlus className="h-4 w-4" />
                    <span>Share Your First Idea</span>
                  </button>
                </div>
              ) : (
                posts.map((post) => (
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
                    <div className="px-6 pb-4" onClick={() => openPostModal(post)}>
                      <h2 className="text-xl font-bold text-gray-900 mb-3">
                        {post.title}
                      </h2>

                      <div className="relative">
                        <p className="text-gray-700 leading-relaxed mb-3">
                          {getTwoLineDescription(post.description)}
                        </p>

                        {needsTruncation(post.description) && (
                          <div className="relative">
                            <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                              <span>View More</span>
                              <FaChevronDown className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
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
                          onClick={() => handleSave(post._id)}
                          className={`p-2 rounded-full transition-all ${
                            savedPosts.has(post._id)
                              ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                              : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
                          }`}
                          title={
                            savedPosts.has(post._id)
                              ? "Remove from saved posts"
                              : "Save post"
                          }
                        >
                          {savedPosts.has(post._id) ? (
                            <FaBookmark className="h-4 w-4" />
                          ) : (
                            <FaRegBookmark className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Post Detail Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gradient-to-br backdrop-blur-md"
            onClick={closePostModal}
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200/50">
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

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] bg-gradient-to-br from-white via-gray-50/30 to-indigo-50/20">
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
                      onClick={() => handleSave(selectedPost._id)}
                      className={`p-3 rounded-full transition-all shadow-sm ${
                        savedPosts.has(selectedPost._id)
                          ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100 shadow-yellow-100"
                          : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 bg-white hover:shadow-yellow-100"
                      }`}
                    >
                      {savedPosts.has(selectedPost._id) ? (
                        <FaBookmark className="h-5 w-5" />
                      ) : (
                        <FaRegBookmark className="h-5 w-5" />
                      )}
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

export default Homepage;
