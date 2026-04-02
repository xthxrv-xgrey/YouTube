import useAuthStore from "../../store/useAuthStore";

const Sidebar = () => {
  const { user } = useAuthStore();

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0F] overflow-y-auto py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Section>
        <NavItem icon={<HomeIcon />} label="Home" active />
        <NavItem icon={<ShortsIcon />} label="Shorts" />
        <NavItem icon={<SubscriptionsIcon />} label="Subscriptions" />
      </Section>

      <Divider />

      <Section
        title={
          <div className="flex items-center gap-2 px-1">
            <span className="text-base font-bold">You</span>
            <ChevronRightIcon />
          </div>
        }
      >
        {user ? (
          <NavItem 
            icon={
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=random`} 
                alt="Avatar" 
                className="w-6 h-6 rounded-full object-cover shrink-0" 
              />
            } 
            label="Your channel" 
          />
        ) : (
          <NavItem icon={<UserCircleIcon />} label="Your channel" />
        )}
        <NavItem icon={<HistoryIcon />} label="History" />
        <NavItem icon={<PlaySquareIcon />} label="Your videos" />
        <NavItem icon={<ClockIcon />} label="Watch Later" />
        <NavItem icon={<ThumbsUpIcon />} label="Liked videos" />
      </Section>

      <Divider />

      <Section title="Explore">
        <NavItem icon={<FlameIcon />} label="Trending" />
        <NavItem icon={<MusicIcon />} label="Music" />
        <NavItem icon={<GamepadIcon />} label="Gaming" />
        <NavItem icon={<TrophyIcon />} label="Sports" />
      </Section>

      <Divider />

      <div className="px-6 py-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed font-medium">
          About Press Copyright Contact us Creators Advertise Developers
          <br />
          <br />
          Terms Privacy Policy & Safety How YouTube works Test new features
        </p>
        <p className="text-xs text-zinc-400 mt-4">© 2026 Google LLC</p>
      </div>
    </aside>
  );
};

/* ─── Sidebar Components ─── */
const Section = ({ title, children }) => (
  <div className="px-3 pb-3">
    {title && (
      <h3 className="px-3 pt-3 pb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center">
        {title}
      </h3>
    )}
    {children}
  </div>
);

const NavItem = ({ icon, label, active }) => (
  <button
    className={`w-full flex items-center gap-5 px-3 py-2.5 rounded-lg transition-colors
    ${
      active
        ? "bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-zinc-100"
        : "hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 font-normal"
    }`}
  >
    <div
      className={`text-zinc-800 dark:text-zinc-200 flex items-center justify-center w-6 h-6 ${active ? "[&>svg]:stroke-[2px]" : "[&>svg]:stroke-[1.5px]"}`}
    >
      {icon}
    </div>
    <span className="text-sm truncate">{label}</span>
  </button>
);

const Divider = () => (
  <div className="border-t border-zinc-200 dark:border-zinc-800 my-1 mx-4" />
);

/* ─── Minimal Icons ─── */
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ShortsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M14.6 15.6 10 13V9l4.6 2.6L19 14.1l-2.6-4.6-4.6-2.6L10 9.9l2.6 4.6 4.6 2.6V15.6Z" />
    <rect width="18" height="18" x="3" y="3" rx="4" />
  </svg>
);
const SubscriptionsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <polygon points="10 11 10 17 15 14 10 11" />
  </svg>
);
const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);
const PlaySquareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <polyline points="10 8 16 12 10 16 10 8" />
  </svg>
);
const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const ThumbsUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);
const FlameIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const MusicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="8" cy="18" r="4" />
    <path d="M12 18V2l7 4" />
  </svg>
);
const GamepadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <path d="M6 12h4" />
    <path d="M8 10v4" />
    <line x1="15" x2="15.01" y1="13" y2="13" />
    <line x1="18" x2="18.01" y1="11" y2="11" />
  </svg>
);
const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const UserCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);

export default Sidebar;
