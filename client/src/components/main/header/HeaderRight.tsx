import { Bell, CircleUserRound, EllipsisVertical, Plus } from "lucide-react";
import { Link } from "react-router";

import { useAuth } from "@/shared/hooks/useAuth";

const HeaderRight = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Don't render auth-dependent UI while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-row items-center justify-center gap-5">
        <div className="h-10 w-10 animate-pulse rounded-full bg-surface-secondary" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex flex-row items-center justify-center gap-5">
        {/* Create */}
        <button
          type="button"
          className="flex cursor-pointer flex-row items-center gap-2 rounded-full bg-surface-secondary px-4 py-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="cursor-pointer rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-10 w-10 rounded-full p-2 hover:bg-surface-secondary" />
        </button>

        {/* User avatar */}
        <button
          type="button"
          className="cursor-pointer rounded-full"
          aria-label="User profile"
        >
          <img
            src={user.avatarUrl}
            alt={user.name ?? "User avatar"}
            className="h-10 w-10 rounded-full object-cover"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-center gap-5">
      <EllipsisVertical className="w-10 h-10 p-2 rounded-full hover:bg-surface-secondary cursor-pointer" />

      <Link
        to="/auth/login"
        className="flex flex-row items-center justify-center gap-2 rounded-full border border-border px-4 py-2 hover:bg-surface-secondary"
      >
        <CircleUserRound className="h-6 w-6 text-blue-400" />
        <span className="text-sm text-blue-400">Sign in</span>
      </Link>
    </div>
  );
};

export default HeaderRight;
