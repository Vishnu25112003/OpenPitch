import React, { useEffect, useState } from "react";
import { FaUser,FaComment,FaHeart } from "react-icons/fa";

interface Idea{
  _id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  userId: {_id:string; name:string;}
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

      <div className="p-4 ">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">All Ideas</h2>
      <div className="flex flex-col space-y-4 justify-center items-center ">

        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow bg-white mb-10">
            <div className="flex items-center">
              <FaUser className="text-6xl text-blue-500" />
              <p className="text-blue-600 mt-2 ">CreatedBy:{post.userId.name || "Unknown"} </p>
            </div>
            <div className="mb-2 flex justify-between">
              <h3 className="text-xl font-bold text-blue-800">{post.title}</h3>
              <p><span className="font-semibold">Category:</span> {post.category}</p>
            </div>
            <p className="text-gray-600 mb-2">{post.description}</p>
            {post.image && (
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
                alt={post.title}
                className="w-full max-h-64 object-cover mt-2 rounded"
              />
            )}
          <div className="flex justify-between">
            <button className="cursor-pointer"><FaComment className="text-4xl text-blue-600 pt-4" /></button>
            <button className="cursor-pointer"><FaHeart className="text-4xl text-blue-600 pt-4" /></button>
          </div>
          </div>
        ))}
      </div>
    </div>
    

    </div>
  );
};

export default Homepage;
