import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl font-bold underline">Home</h1>
      <Link
        to="/auth/login"
        className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2"
      >
        Login
      </Link>
      <Link
        to="/auth/register"
        className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2"
      >
        Register
      </Link>
    </div>
  );
};

export default Home;
