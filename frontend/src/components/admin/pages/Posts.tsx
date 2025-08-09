// Posts.tsx
import React, { useState, useEffect } from "react";
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

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/idea/ideas");
        const data = await response.json();
        console.log("Posts data:", data);

        // Debug: Check what image fields are available
        if (data.length > 0) {
          console.log("Sample post structure:", data[0]);
          console.log(
            "Available image fields:",
            Object.keys(data[0]).filter(
              (key) =>
                key.toLowerCase().includes("image") ||
                key.toLowerCase().includes("img") ||
                key.toLowerCase().includes("photo") ||
                key.toLowerCase().includes("picture")
            )
          );
        }

        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  // Function to get image URL from different possible field names
  const getImageUrl = (post: Post): string | null => {
    const possibleImageFields = [
      post.image,
      post.imageUrl,
      post.img,
      post.picture,
      post.photo,
      (post as any).Image,
      (post as any).ImageUrl,
      (post as any).IMG,
      (post as any).Picture,
      (post as any).Photo,
    ];

    for (const imageField of possibleImageFields) {
      if (
        imageField &&
        typeof imageField === "string" &&
        imageField.trim() !== ""
      ) {
        // Handle relative URLs
        if (
          imageField.startsWith("/uploads") ||
          imageField.startsWith("uploads")
        ) {
          return `http://localhost:5000/${
            imageField.startsWith("/") ? imageField.slice(1) : imageField
          }`;
        }
        // Handle full URLs
        if (imageField.startsWith("http")) {
          return imageField;
        }
        // Handle base64 images
        if (imageField.startsWith("data:image")) {
          return imageField;
        }
        // Assume it's a filename in uploads folder
        return `http://localhost:5000/uploads/${imageField}`;
      }
    }
    return null;
  };

  const handleDelete = async (postId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/idea/delete/${postId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post. Please try again.");
    }
  };

  const openPostModal = (post: Post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closePostModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = "unset"; // Restore scrolling
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
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
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
          /* Grid View */
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
                        onLoad={() =>
                          console.log("Image loaded successfully:", imageUrl)
                        }
                        onError={(e) => {
                          console.log("Image failed to load:", imageUrl);
                          (e.target as HTMLImageElement).style.display = "none";
                          (
                            e.target as HTMLImageElement
                          ).nextElementSibling?.classList.remove("hidden");
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

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                        <FaTag className="mr-1" />
                        {post.category || "Uncategorized"}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDelete(post._id, e)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 space-y-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {truncateDescription(
                        post.description || "No description available"
                      )}
                    </p>

                    {/* Meta Information */}
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

                    {/* Stats */}
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
          /* List View */
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
                    {/* Image Thumbnail */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Post"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(
                              "List view image failed to load:",
                              imageUrl
                            );
                            (e.target as HTMLImageElement).style.display =
                              "none";
                            (
                              e.target as HTMLImageElement
                            ).nextElementSibling?.classList.remove("hidden");
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

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                          <FaTag className="mr-1" />
                          {post.category || "Uncategorized"}
                        </span>
                        <button
                          onClick={(e) => handleDelete(post._id, e)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
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

        {/* Glass Effect Modal */}
        {selectedPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))",
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
              {/* Close Button */}
              <button
                onClick={closePostModal}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 p-3 rounded-full transition-all duration-300 shadow-lg"
                style={{
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                <FaTimes className="text-lg" />
              </button>

              {/* Image Section */}
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

              {/* Content Section */}
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span
                    className="text-blue-800 text-sm font-semibold px-4 py-2 rounded-full flex items-center shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
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
                      backdropFilter: "blur(5px)",
                      WebkitBackdropFilter: "blur(5px)",
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
                          {new Date(selectedPost.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      handleDelete(selectedPost._id, e);
                      closePostModal();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    <FaTrash />
                    <span className="font-medium">Delete Post</span>
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
