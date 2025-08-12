import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { FaArrowLeft, FaUser } from "react-icons/fa";

interface Comment {
  _id: string;
  commentText: string;
  createdAt: string;
  userId: {
    _id: string; // Added user ID to compare with current user
    name: string;
  };
}

const CommentPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Function to get current user ID from token
  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT token to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId || payload.id);
      } catch (error) {
        console.error("Error decoding token:", error);
        setCurrentUserId(null);
      }
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/review/${id}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/review/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ commentText }),
      });

      const data = await res.json();
      if (res.ok) {
        setCommentText("");
        fetchComments();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getCurrentUserId(); // Get current user ID when component mounts
    fetchComments();
  }, []);

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/review/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        fetchComments();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

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
              <h1 className="text-xl font-bold text-gray-900">Comments</h1>
            </div>
            <span className="text-sm text-gray-500">{comments.length} comments</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Comment Input Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <form onSubmit={handleCommentSubmit}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FaUser className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this idea..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
                  rows={3}
                  required
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !commentText.trim()}
                    className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                      isSubmitting || !commentText.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts on this idea!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <img
                        src={`https://ui-avatars.com/api/?name=${comment.userId.name}&background=6366f1&color=fff`}
                        alt={comment.userId.name}
                        className="h-10 w-10 rounded-full border-2 border-gray-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {comment.userId.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {comment.commentText}
                      </p>
                    </div>
                  </div>
                  {/* Only show delete button if current user is the comment author */}
                  {currentUserId && currentUserId === comment.userId._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-4"
                      title="Delete comment"
                    >
                      <AiOutlineDelete className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


export default CommentPage;