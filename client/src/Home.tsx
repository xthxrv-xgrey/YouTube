import { Link } from "react-router";

const Home = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center gap-20 text-3xl text-blue-400">
      <Link to="/auth/login">Login</Link>
      <Link to="/auth/register">Register</Link>
    </div>
  );
};

export default Home;
