import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import ThemeToggle from "../ThemeToggle";
import logo from "../../assets/images/favicon_144x144.png";

const Header = () => {
  const { user, logout, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    if (user && user._id) {
      fetchCurrentUser();
    }
  }, [user?._id]);

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-2 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0F0F0F]/95 backdrop-blur-md z-40 sticky top-0 shrink-0 mt-0">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-full transition-colors hidden sm:block">
          <MenuIcon />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="text-xl font-semibold tracking-tight hidden sm:block">
            YouTube
          </span>
        </Link>
      </div>

      {/* Search Bar - Skeleton */}
      <div className="flex-1 max-w-2xl px-8 hidden md:flex items-center">
        <div className="flex w-full items-center">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-zinc-50 dark:bg-[#121212] border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 px-4 py-2.5 rounded-l-full outline-none focus:border-blue-500 shadow-inner dark:shadow-none placeholder-zinc-500"
          />
          <button className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-l-0 border-zinc-300 dark:border-zinc-700 rounded-r-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <SearchIcon />
          </button>
        </div>
        <button className="ml-4 p-2.5 bg-zinc-100 dark:bg-[#1A1A1A] hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors shrink-0">
          <MicIcon />
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-full transition-colors hidden sm:block">
              <BellIcon />
            </button>
            <div className="relative group cursor-pointer inline-flex items-center gap-2">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.username || "User"}&background=random`
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm object-cover"
              />
              {/* Dropdown to logout */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-1 z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                  <p className="font-medium text-sm truncate">
                    {user.fullName?.firstName} {user.fullName?.lastName}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    @{user.username}
                  </p>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-left w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/auth/login"
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 rounded-full transition-all"
            >
              <UserIcon />
              <span>Sign in</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

/* ─── Minimal Icons ─── */
const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <line x1="3" x2="21" y1="6" y2="6" />
    <line x1="3" x2="21" y1="12" y2="12" />
    <line x1="3" x2="21" y1="18" y2="18" />
  </svg>
);
const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const MicIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);
const BellIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
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

export default Header;
