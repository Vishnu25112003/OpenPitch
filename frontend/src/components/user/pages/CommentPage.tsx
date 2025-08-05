import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Comment {
  _id: string;
  content: string;
  userId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const CommentPage: React.FC = () => {
  const { id: ideaId } = useParams(); // ✅ Get ideaId from URL like /comment/:id

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/review/comment/${ideaId}`
      );
      if (!res.ok) {
        console.error("Failed to fetch comments:", res.status);
        return;
      }
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

const handleSubmit = async () => {
  if (!newComment) return;

  console.log("Submitting comment:", newComment);
  console.log("ideaId:", ideaId);
  console.log("userId:", user._id);

  try {
    const res = await fetch(`http://localhost:5000/api/review/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newComment,
        ideaId,
        userId: user._id,
      }),
    });

    const data = await res.json();
    console.log("Response from server:", data);

    if (res.ok) {
      setNewComment("");
      fetchComments();
    } else {
      console.error("Comment failed:", res.status);
    }
  } catch (error) {
    console.error("Comment error:", error);
  }
};


  useEffect(() => {
    if (ideaId) {
      fetchComments();
    }
  }, [ideaId]);

  return (
    <div className="mt-4 p-4 border-t">
      <h3 className="text-lg font-bold text-blue-800 mb-2">Comments</h3>

      <div className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border rounded p-2"
          rows={2}
          placeholder="Write a comment..."
        />
        <button
          onClick={handleSubmit}
          className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
        >
          Submit
        </button>
      </div>

      <div>
        {comments.map((comment) => (
          <div key={comment._id} className="mb-2">
            <p className="text-sm text-gray-800">
              <span className="font-semibold text-blue-700">
                {comment.userId?.name || "Anonymous"}
              </span>{" "}
              commented at {new Date(comment.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-600 ml-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentPage;
