import React, { useEffect, useState } from "react";
import {
  FaComment,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaArrowLeft,
  FaUser,
  FaClock,
  FaTag,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

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
  commentCount?: number;
  savedBy?: string[];
  likedBy?: string[];
}

const PostDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

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
        setCurrentUserId(user._id);
        return true;
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
        return false;
      }
    };

    if (checkAuth() && id) {
      fetchPost();
    }
  }, [id, navigate]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:5000/api/idea/ideas/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const postData = await response.json();

      // Fetch comment count
      try {
        const commentResponse = await fetch(
          `http://localhost:5000/api/review/${id}`
        );
        if (commentResponse.ok) {
          const comments = await commentResponse.json();
          postData.commentCount = Array.isArray(comments) ? comments.length : 0;
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        postData.commentCount = postData.comments || 0;
      }

      setPost(postData);

      // Check if post is liked/saved by current user
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsLiked(postData.likedBy?.includes(user._id) || false);
        setIsSaved(postData.savedBy?.includes(user._id) || false);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Failed to load post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like posts");
      navigate("/login");
      return;
    }

    const wasLiked = isLiked;
    const previousLikeCount = post.like ?? 0;

    // Optimistic update
    setIsLiked(!wasLiked);
    setPost((prev) =>
      prev ? { ...prev, like: (prev.like || 0) + (wasLiked ? -1 : 1) } : null
    );

    try {
      const response = await fetch(
        `http://localhost:5000/api/review/like/${post._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Revert optimistic updates on error
        setIsLiked(wasLiked);
        setPost((prev) => (prev ? { ...prev, like: previousLikeCount } : null));

        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setPost((prev) => (prev ? { ...prev, like: data.like } : null));
    } catch (error) {
      console.error("Error liking post:", error);
      alert(
        `Failed to like post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleSave = async () => {
    if (!post) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save posts");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/review/save/${post._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ savePost: !isSaved }),
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

      setIsSaved(!isSaved);

      if (isSaved) {
        alert("Post removed from saved posts!");
      } else {
        alert("Post saved successfully!");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert(
        `Failed to ${isSaved ? "unsave" : "save"} post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleShare = async () => {
    if (!post) return;

    const postUrl = `${window.location.origin}/post/${post._id}`;
    const shareData = {
      title: post.title,
      text: post.description.substring(0, 100) + "...",
      url: postUrl,
    };

    try {
      // Check if Web Share API is supported
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(
          `Check out this amazing idea: "${post.title}" - ${postUrl}`
        );

        // Show success message
        const existingToast = document.querySelector(".share-toast");
        if (existingToast) {
          existingToast.remove();
        }

        const toast = document.createElement("div");
        toast.className =
          "share-toast fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300";
        toast.textContent = "Post link copied to clipboard!";
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.opacity = "0";
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      }
    } catch (error) {
      console.error("Error sharing:", error);

      // Show error message
      const existingToast = document.querySelector(".share-toast");
      if (existingToast) {
        existingToast.remove();
      }

      const toast = document.createElement("div");
      toast.className =
        "share-toast fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300";
      toast.textContent = "Failed to share post";
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };

  const handleComment = () => {
    if (post) {
      navigate(`/comment/${post._id}`);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      technology: "bg-blue-100 text-blue-800 border-blue-200",
      lifestyle: "bg-green-100 text-green-800 border-green-200",
      business: "bg-purple-100 text-purple-800 border-purple-200",
      education: "bg-yellow-100 text-yellow-800 border-yellow-200",
      health: "bg-red-100 text-red-800 border-red-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Back button skeleton */}
          <div className="h-10 w-24 bg-gray-200 rounded-lg mb-8"></div>

          {/* Post content skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {/* Header skeleton */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>

            {/* Title skeleton */}
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>

            {/* Image skeleton */}
            <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>

            {/* Description skeleton */}
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Actions skeleton */}
            <div className="flex items-center space-x-6">
              <div className="h-12 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-12 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-12 w-24 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ErrorDisplay = ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md mx-4">
        <div className="text-8xl mb-6">⚠️</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Post not found
        </h3>
        <p className="text-gray-500 text-lg mb-6">{message}</p>
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !post) {
    return (
      <ErrorDisplay message={error || "Post not found"} onRetry={fetchPost} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 shadow-sm border border-gray-200 mb-8"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span className="font-medium">Back</span>
        </button>

        {/* Post Content */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Post Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200/50 p-8">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  post.userId.name || "User"
                )}&background=6366f1&color=fff`}
                alt={post.userId.name}
                className="h-16 w-16 rounded-full border-3 border-white shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">
                    {post.userId.name || "Unknown"}
                  </h4>
                  <FaUser className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <FaClock className="h-4 w-4" />
                    <span>{formatTimeAgo(post.createdAt || "")}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaTag className="h-4 w-4" />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                        post.category
                      )}`}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
          </div>

          {/* Post Body */}
          <div className="p-8">
            {post.image && (
              <div className="mb-8">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 bg-gray-50">
                  <img
                    src={`http://localhost:5000/${post.image}`}
                    alt={post.title}
                    className="w-full max-h-96 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {post.description}
              </p>
            </div>

            {/* Post Actions */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isLiked
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl shadow-red-200 border-2 border-red-400"
                        : "text-gray-600 hover:text-red-600 hover:bg-red-50 bg-white border-2 border-gray-200 hover:border-red-200 shadow-sm hover:shadow-red-100"
                    }`}
                  >
                    {isLiked ? (
                      <FaHeart className="h-5 w-5 animate-pulse" />
                    ) : (
                      <FaRegHeart className="h-5 w-5" />
                    )}
                    <span className="font-bold text-lg">{post.like ?? 0}</span>
                    <span className="text-sm font-medium">
                      {isLiked ? "Liked" : "Like"}
                    </span>
                  </button>

                  <button
                    onClick={handleComment}
                    className="flex items-center space-x-2 px-4 py-3 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-white transition-all shadow-sm hover:shadow-blue-100 border border-gray-200"
                  >
                    <FaComment className="h-5 w-5" />
                    <span className="font-medium text-lg">
                      {post.commentCount ?? post.comments ?? 0}
                    </span>
                    <span className="text-sm font-medium">Comments</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-3 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 bg-white transition-all shadow-sm hover:shadow-green-100 border border-gray-200"
                  >
                    <FaShare className="h-5 w-5" />
                    <span className="font-medium text-lg">Share</span>
                  </button>
                </div>

                <button
                  onClick={handleSave}
                  className={`p-3 rounded-full transition-all shadow-sm border ${
                    isSaved
                      ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100 shadow-yellow-100 border-yellow-200"
                      : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 bg-white hover:shadow-yellow-100 border-gray-200"
                  }`}
                  title={isSaved ? "Remove from saved posts" : "Save post"}
                >
                  {isSaved ? (
                    <FaBookmark className="h-5 w-5" />
                  ) : (
                    <FaRegBookmark className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
