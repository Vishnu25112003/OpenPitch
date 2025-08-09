import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaComment,
  FaCalendar,
  FaUser,
  FaTag,
  FaTrash,
  FaSearch,
  FaPlus,
  FaExpand,
  FaTimes,
  FaImage,
} from "react-icons/fa";

interface Post {
  _id: string;
  description: string;
  category: string;
  userId?: { name: string };
  like: number;
  comments: number;
  createdAt: string;
  image?: string;
  imageUrl?: string;
  img?: string;
  picture?: string;
  photo?: string;
}

const API_BASE = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // If your GET requires auth, include headers. If not, this still works.
        const res = await fetch(`${API_BASE}/api/idea/ideas`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            alert("Authentication required. Please log in again.");
            window.location.replace("/login");
            return;
          }
          throw new Error(`Failed to load posts (status ${res.status})`);
        }
        const data = await res.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredPosts(posts);
      return;
    }
    try {
      const filtered = posts.filter((post) => {
        const desc = post.description?.toLowerCase() || "";
        const cat = post.category?.toLowerCase() || "";
        const user = post.userId?.name?.toLowerCase() || "";
        return desc.includes(term) || cat.includes(term) || user.includes(term);
      });
      setFilteredPosts(filtered);
    } catch (e) {
      console.error("Filter error:", e);
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  // Resolve image URL from various possible fields and formats
  const getImageUrl = (post: Post): string | null => {
    const candidates = [
      post.image,
      post.imageUrl,
      post.img,
      post.picture,
      post.photo,
      (post as any)?.Image,
      (post as any)?.ImageUrl,
      (post as any)?.IMG,
      (post as any)?.Picture,
      (post as any)?.Photo,
    ];

    for (const c of candidates) {
      if (typeof c === "string" && c.trim() !== "") {
        const val = c.trim();
        if (val.startsWith("http")) return val;
        if (val.startsWith("data:image")) return val;
        if (val.startsWith("/uploads")) return `${API_BASE}${val}`;
        if (val.startsWith("uploads")) return `${API_BASE}/${val}`;
        return `${API_BASE}/uploads/${val}`;
      }
    }
    return null;
  };

  const handleDelete = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Ensure token exists before calling API
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      window.location.replace("/login");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setDeletingId(postId);
      const res = await fetch(`${API_BASE}/api/idea/delete/${postId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        // Handle common auth errors clearly
        if (res.status === 401 || res.status === 403) {
          alert("Unauthorized. Please log in again.");
          window.location.replace("/login");
          return;
        }
        let msg = `Failed to delete (status ${res.status})`;
        try {
          const err = await res.json();
          if (err?.message) msg = err.message;
        } catch {}
        alert(msg);
        return;
      }

      // Update local state
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setFilteredPosts((prev) => prev.filter((p) => p._id !== postId));

      if (selectedPost?._id === postId) {
        setSelectedPost(null);
        document.body.style.overflow = "unset";
      }

      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error deleting post. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const openPostModal = (post: Post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closePostModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Posts Management</h1>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Posts Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              List
            </button>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <FaPlus />
            <span>Add Post</span>
          </button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        </div>

        {/* Posts Display */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-500">
              {posts.length === 0
                ? "No posts have been created yet"
                : "Try adjusting your search criteria"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => {
              const imageUrl = getImageUrl(post);
              return (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer transform hover:-translate-y-1 group"
                  onClick={() => openPostModal(post)}
                >
                  {/* Image Section */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Post"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className={`${
                        imageUrl ? "hidden" : "flex"
                      } absolute inset-0 items-center justify-center text-white`}
                    >
                      <div className="text-center">
                        <FaImage className="text-4xl mb-2 opacity-50" />
                        <p className="text-sm opacity-75">No Image</p>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                        <FaTag className="mr-1" />
                        {post.category || "Uncategorized"}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(post._id, e)}
                      disabled={deletingId === post._id}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                        deletingId === post._id
                          ? "bg-gray-300 cursor-not-allowed text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                      title="Delete post"
                    >
                      {deletingId === post._id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <FaTrash className="text-sm" />
                      )}
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 space-y-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {truncateDescription(
                        post.description || "No description available"
                      )}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <FaUser />
                          <span>{post.userId?.name || "Anonymous"}</span>
                        </div>
                        {post.createdAt && (
                          <div className="flex items-center space-x-1">
                            <FaCalendar />
                            <span>
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-GB"
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-red-500">
                          <FaHeart className="text-sm" />
                          <span className="text-sm font-medium">
                            {post.like || 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-500">
                          <FaComment className="text-sm" />
                          <span className="text-sm font-medium">
                            {post.comments || 0}
                          </span>
                        </div>
                      </div>
                      <FaExpand className="text-gray-400 text-sm" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const imageUrl = getImageUrl(post);
              return (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer"
                  onClick={() => openPostModal(post)}
                >
                  <div className="flex items-start p-6 space-x-4">
                    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Post"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}
                      <div
                        className={`${
                          imageUrl ? "hidden" : "flex"
                        } w-full h-full items-center justify-center text-white`}
                      >
                        <FaImage className="text-xl opacity-50" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                          <FaTag className="mr-1" />
                          {post.category || "Uncategorized"}
                        </span>
                        <button
                          onClick={(e) => handleDelete(post._id, e)}
                          disabled={deletingId === post._id}
                          className={`text-white p-2 rounded-lg transition-colors ${
                            deletingId === post._id
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                          title="Delete post"
                        >
                          {deletingId === post._id ? "Deleting..." : <FaTrash />}
                        </button>
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {truncateDescription(
                          post.description || "No description available",
                          200
                        )}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FaUser />
                            <span>{post.userId?.name || "Anonymous"}</span>
                          </div>
                          {post.createdAt && (
                            <div className="flex items-center space-x-1">
                              <FaCalendar />
                              <span>
                                {new Date(post.createdAt).toLocaleDateString(
                                  "en-GB"
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-red-500">
                            <FaHeart />
                            <span className="text-sm font-medium">
                              {post.like || 0}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-blue-500">
                            <FaComment />
                            <span className="text-sm font-medium">
                              {post.comments || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Glass/Mirror Effect Modal */}
        {selectedPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.25))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            onClick={closePostModal}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePostModal}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 p-3 rounded-full transition-all duration-300 shadow-lg"
              >
                <FaTimes className="text-lg" />
              </button>

              {(() => {
                const imageUrl = getImageUrl(selectedPost);
                return imageUrl ? (
                  <div className="w-full h-64 md:h-80 overflow-hidden rounded-t-2xl">
                    <img
                      src={imageUrl}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full h-64 rounded-t-2xl flex items-center justify-center text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <div className="text-center">
                      <FaImage className="text-6xl mb-4 opacity-70" />
                      <p className="text-lg opacity-90">No Image Available</p>
                    </div>
                  </div>
                );
              })()}

              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span
                    className="text-blue-800 text-sm font-semibold px-4 py-2 rounded-full flex items-center shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    <FaTag className="mr-2" />
                    {selectedPost.category || "Uncategorized"}
                  </span>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-red-500">
                      <FaHeart className="text-xl" />
                      <span className="font-medium text-lg">
                        {selectedPost.like || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-500">
                      <FaComment className="text-xl" />
                      <span className="font-medium text-lg">
                        {selectedPost.comments || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Full Description
                  </h2>
                  <div
                    className="p-6 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap text-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    {selectedPost.description || "No description available"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white border-opacity-30">
                  <div className="flex items-center space-x-6 text-gray-700">
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-xl" />
                      <span className="font-medium text-lg">
                        {selectedPost.userId?.name || "Anonymous"}
                      </span>
                    </div>
                    {selectedPost.createdAt && (
                      <div className="flex items-center space-x-3">
                        <FaCalendar className="text-xl" />
                        <span className="text-lg">
                          {new Date(
                            selectedPost.createdAt
                          ).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(selectedPost._id, e)}
                    disabled={deletingId === selectedPost._id}
                    className={`px-6 py-3 rounded-xl flex items-center space-x-3 transition-all duration-300 shadow-lg ${
                      deletingId === selectedPost._id
                        ? "bg-gray-300 cursor-not-allowed text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {deletingId === selectedPost._id ? (
                      <span>Deleting...</span>
                    ) : (
                      <>
                        <FaTrash />
                        <span className="font-medium">Delete Post</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
