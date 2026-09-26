import { Bell, CircleUserRound, EllipsisVertical, Plus } from "lucide-react";
import { Link } from "react-router";

import { useAuth } from "@/shared/hooks/useAuth";
import { useUserMenu } from "@/shared/hooks/useUserMenu";
import UserMenu from "@/features/user-menu/presentation/ui/UserMenu";

const HeaderRight = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isOpen, toggle } = useUserMenu();

  if (isLoading) {
    return (
      <div className="flex flex-row items-center justify-center gap-5">
        <div className="h-10 w-10 animate-pulse rounded-full bg-surface-secondary" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex flex-row items-center justify-center gap-4">
        {/* Create */}
        <button
          type="button"
          className="flex cursor-pointer flex-row items-center gap-2 rounded-full bg-surface-secondary px-4 py-2"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm">Create</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="cursor-pointer rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-10 w-10 rounded-full p-2 hover:bg-surface-secondary" />
        </button>

        {/* User */}
        <div className="relative">
          <button
            type="button"
            onClick={toggle}
            className="cursor-pointer rounded-full"
            aria-label="User profile"
            aria-expanded={isOpen}
          >
            <img
              src={user.avatarUrl}
              alt={user.name ?? "User avatar"}
              className="h-8 w-8 rounded-full object-cover"
            />
          </button>

          {isOpen && <UserMenu />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-center gap-5">
      <EllipsisVertical
        className="h-10 w-10 cursor-pointer rounded-full p-2 hover:bg-surface-secondary"
        onClick={toggle}
      />

      <Link
        to="/auth/login"
        className="flex flex-row items-center justify-center gap-2 rounded-full border border-border px-4 py-2 hover:bg-surface-secondary"
      >
        <CircleUserRound className="h-6 w-6 text-blue-400" />
        <span className="text-sm text-blue-400">Sign in</span>
      </Link>

      {isOpen && <UserMenu />}
    </div>
  );
};

export default HeaderRight;
