import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#0F0F0F] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 overflow-hidden">
      <Header />

      {/* Layout Grid */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 bg-zinc-50 dark:bg-black overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Categories Pill Bar */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {[
              "All",
              "Gaming",
              "Music",
              "Live",
              "React routers",
              "Mixes",
              "Computers",
              "Podcasts",
              "Recently uploaded",
              "Watched",
              "New to you",
            ].map((cat, i) => (
              <button
                key={i}
                className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0
                  ${
                    i === 0
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-zinc-200/50 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Video Grid Skeleton */}
          {user ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl relative overflow-hidden shrink-0">
                    <img
                      src={`https://picsum.photos/seed/${i + 50}/640/360`}
                      alt="Thumbnail"
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
                      {Math.floor(Math.random() * 20)}:
                      {Math.floor(Math.random() * 50) + 10}
                    </span>
                  </div>
                  {/* Details */}
                  <div className="flex gap-3 pr-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=Channel+${i}&background=random`}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full mt-0.5 shrink-0"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Building a Modern Web Application with React and
                        Tailwind CSS
                      </h3>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                        Channel Name {i + 1}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {Math.floor(Math.random() * 900) + 10}K views •{" "}
                        {Math.floor(Math.random() * 11) + 1} months ago
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
              <div className="w-24 h-24 mb-6 text-zinc-300 dark:text-zinc-800">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 tracking-tight">
                Enjoy your favorite videos
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                Sign in to access videos, comment, and subscribe.
              </p>
              <Link
                to="/auth/login"
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors shadow-sm"
              >
                <UserIcon />
                Sign In
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

export default Home;
