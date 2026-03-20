import React, { useEffect, useState } from "react";
import Card from "./components/Card";

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const url = `${import.meta.env.VITE_API_URL}/api/v1/users/getUsers`;
        const url = `http://localhost:4000/api/v1/users/getUsers`;
        console.log("Fetching from:", url);

        const response = await fetch(url);
        const result = await response.json();

        console.log("API Response:", result);

        if (result.success) {
          setUsers(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  if (error) {
    return <h2 className="text-center mt-10 text-red-500">{error}</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Users List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((user) => <Card key={user._id} user={user} />)
        ) : (
          <p className="text-center col-span-full">No users found</p>
        )}
      </div>
    </div>
  );
};

export default App;
