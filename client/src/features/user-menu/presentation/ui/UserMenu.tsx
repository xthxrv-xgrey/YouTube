import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import {
  Settings,
  Moon,
  Languages,
  MapPin,
  Keyboard,
  HelpCircle,
  MessageSquare,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Video,
  Sun,
  LogOut,
  User,
} from "lucide-react";

const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isLight, toggleTheme } = useTheme();

  return (
    <div
      className="
        absolute right-0 top-12 z-50
        w-90
        overflow-hidden
        rounded-xl
        border border-border
        bg-background
        text-foreground
        shadow-2xl
      "
    >
      {/* Profile */}
      {isAuthenticated && user && (
        <div className="flex items-start gap-4 border-b border-border px-5 py-4">
          <img
            src={user.avatarUrl}
            alt={user.name ?? "User avatar"}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />

          <div className="min-w-0">
            <h2 className="truncate text-md font-medium">{user.name}</h2>

            <p className="truncate text-sm text-gray-400">@{user.username}</p>

            <button
              type="button"
              className="mt-1 text-sm text-[#3ea6ff] hover:text-[#65baff]"
            >
              View your channel
            </button>
          </div>
        </div>
      )}

      {/* Account */}
      {isAuthenticated && user && (
        <div className="py-2">
          <MenuItem icon={<User size={20} />} label="Google Account" />

          <MenuItem icon={<User size={20} />} label="Switch account" chevron />

          <MenuItem
            icon={<LogOut size={20} />}
            label="Sign out"
            onClick={logout}
          />
        </div>
      )}

      <Divider />

      {/* YouTube */}
      {isAuthenticated && user && (
        <div className="py-2">
          <MenuItem icon={<Video size={20} />} label="YouTube Studio" />

          <MenuItem
            icon={<CreditCard size={20} />}
            label="Purchases and memberships"
          />

          <MenuItem
            icon={<ShieldCheck size={20} />}
            label="Your data in YouTube"
          />
        </div>
      )}

      <Divider />

      {/* Preferences */}
      <div className="py-2">
        <MenuItem
          icon={isLight ? <Sun size={20} /> : <Moon size={20} />}
          label={`Appearance: ${isLight ? "Light" : "Dark"}`}
          onClick={toggleTheme}
          chevron
        />

        <MenuItem
          icon={<Languages size={20} />}
          label="Display language: English"
          chevron
        />

        <MenuItem
          icon={<ShieldCheck size={20} />}
          label="Restricted Mode: Off"
          chevron
        />

        <MenuItem icon={<MapPin size={20} />} label="Location: India" chevron />

        <MenuItem icon={<Keyboard size={20} />} label="Keyboard shortcuts" />
      </div>

      <Divider />

      {/* Bottom */}
      <div className="py-2">
        <MenuItem icon={<Settings size={20} />} label="Settings" />

        <MenuItem icon={<HelpCircle size={20} />} label="Help" />

        <MenuItem icon={<MessageSquare size={20} />} label="Send feedback" />
      </div>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  chevron?: boolean;
  onClick?: () => void;
}

const MenuItem = ({ icon, label, chevron = false, onClick }: MenuItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full items-center gap-5
        px-5 py-3
        text-left text-sm
        transition-colors
        hover:bg-surface-secondary
      "
    >
      <span className="flex w-5 shrink-0 items-center justify-center">
        {icon}
      </span>

      <span className="flex-1">{label}</span>

      {chevron && <ChevronRight size={18} className="text-gray-400" />}
    </button>
  );
};

const Divider = () => <div className="h-px bg-border" />;

export default UserMenu;
