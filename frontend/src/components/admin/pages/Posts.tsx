import React, { useEffect, useState } from "react";

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
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (postId: string) => {
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        alert("You must be logged in as admin to delete posts.");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/idea/delete/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Delete failed:", errorData);
        alert(errorData.message || "Failed to delete post.");
        return;
      }

      const result = await res.json();
      console.log(result.message || "Post deleted successfully");
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post. Check console for details.");
    }
  };

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/idea/ideas");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin - Manage Posts</h1>

      {loading ? (
        <p className="text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
            >
              {/* Image */}
              {post.image ? (
                <img
                  src={`http://localhost:5000/${post.image}`}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg mb-4 text-gray-400">
                  No Image
                </div>
              )}

              {/* Content */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 flex-grow">
                {post.description.length > 100
                  ? post.description.slice(0, 100) + "..."
                  : post.description}
              </p>

              <div className="mt-3 text-sm text-gray-500">
                <p>Category: {post.category}</p>
                <p>Author: {post.userId?.name}</p>
                <p>Likes: {post.like || 0}</p>
                <p>Comments: {post.comments || 0}</p>
                {post.createdAt && (
                  <p>
                    Date: {new Date(post.createdAt).toLocaleDateString("en-GB")}
                  </p>
                )}
              </div>

              {/* Admin actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
