import React, { useEffect, useState } from "react";
// import { FaUser } from "react-icons/fa";

interface Idea{
  _id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
}

const Homepage: React.FC = () => {
  const [userName, setUserName] = useState<string>("");

  const [posts, setPosts] = useState<Idea[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/idea/ideas");
        const data = await response.json();
        setPosts(data); 
      } catch (error) {
        console.error("Error fetching ideas:", error);
      }
    };

    fetchIdeas();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
      console.log(user);
    }
  }, []);

  return (
    <div>
      <div className="text-4xl flex justify-center pt-15 text-blue-500 font-bold">
        <h1>Welcome {userName}</h1>
      </div>
      {/* <div>
        <div className="flex items-center justify-center pt-8">
          <div>
            <FaUser className="text-4xl text-blue-500" />
          </div>
          <div>
            <h1>{userName}</h1>
          </div>
        </div>
      </div> */}

        <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">All Ideas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow bg-white">
            <h3 className="text-xl font-bold text-blue-800">{post.title}</h3>
            <p><span className="font-semibold">Category:</span> {post.category}</p>
            <p className="text-gray-600 mb-2">{post.description}</p>
            {post.image && (
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
                alt={post.title}
                className="w-full max-h-64 object-cover mt-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>

    </div>
  );
};

export default Homepage;
