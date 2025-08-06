import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {AiOutlineDelete} from "react-icons/ai";

interface Comment {
  _id: string;
  commentText: string;
  createdAt: string;
  userId: {
    name: string;
  };
}

const CommentPage: React.FC = () => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

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
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/review/${id}`,
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
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Comments</h2>

      <form onSubmit={handleCommentSubmit} className="mb-6">
        <textarea
          className="w-full p-2 border rounded mb-2"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment here..."
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post Comment
        </button>
      </form>

      <div>
        {comments.map((comment) => (
          <div key={comment._id} className="border-b py-2">
            <p className="font-semibold text-blue-700">{comment.userId.name}</p>
            <p>{comment.commentText}</p>
            <p className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-red-500 hover:text-red-700"
            >
              <AiOutlineDelete />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentPage;
