import React, { useEffect, useState } from "react";

interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  likedBy: string[];
}

const TopPosts: React.FC = () => {
  const [topPosts, setTopPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/idea/toppost");
        const data = await res.json();
        setTopPosts(data);
      } catch (error) {
        console.error("Failed to fetch top posts:", error);
      }
    };

    fetchTopPosts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        🔥 Top 3 Most Liked Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topPosts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              ❤️ Likes: {post.likedBy.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPosts;
