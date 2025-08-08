import React, { useEffect, useState } from "react";

interface DashboardData {
  postsCount: number;
  usersCount: number;
  commentCount: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    postsCount: 0,
    usersCount: 0,
    commentCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await fetch("http://localhost:5000/api/idea/postcount");
        const postsData = await postsRes.json();

        const usersRes = await fetch("http://localhost:5000/api/registration/usercount");
        const usersData = await usersRes.json();

        const commentsRes = await fetch("http://localhost:5000/api/review/commentcount");
        const commentsData = await commentsRes.json();

        console.log(
          "postsData", postsData,
          "usersData", usersData,
          "commentsData", commentsData
        );

        setData({
          postsCount: postsData.count || 0,
          usersCount: usersData.count || 0,
          commentCount: commentsData.count || 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-4 flex justify-around">
        <div className="mt-4 border border-gray-300 rounded-2xl p-4">
          <h1 className="text-2xl font-semibold">Comments</h1>
          <h2>count: {data.commentCount}</h2>
        </div>
        <div className="mt-4 border border-gray-300 rounded-2xl p-4">
          <h1 className="text-2xl font-semibold">Posts</h1>
          <h2>count: {data.postsCount}</h2>
        </div>
        <div className="mt-4 border border-gray-300 rounded-2xl p-4">
          <h1 className="text-2xl font-semibold">Users</h1>
          <h2>count: {data.usersCount}</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
