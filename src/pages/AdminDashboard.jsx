import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div>
        <h2 className="text-xl font-semibold">Users</h2>
        <ul className="list-disc pl-6">
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mt-4">Posts</h2>
        <ul className="list-disc pl-6">
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
