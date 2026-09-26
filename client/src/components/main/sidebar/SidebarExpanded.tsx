import { CircleUserRound, Film, House, TvMinimalPlay } from "lucide-react";
import { Link } from "react-router";

const SidebarExpanded = () => {
  return (
    <nav className="h-full w-60 flex flex-col py-5 px-3">
      <Link
        to="/"
        className="flex items-center gap-5 px-4 py-3 rounded-lg hover:bg-surface-secondary"
      >
        <House strokeWidth={1.5} size={24} />
        <p>Home</p>
      </Link>

      <Link
        to="/shorts"
        className="flex items-center gap-5 px-4 py-3 rounded-lg hover:bg-surface-secondary"
      >
        <Film strokeWidth={1.5} size={24} />
        <p>Shorts</p>
      </Link>

      <Link
        to="/feed/subscriptions"
        className="flex items-center gap-5 px-4 py-3 rounded-lg hover:bg-surface-secondary"
      >
        <TvMinimalPlay strokeWidth={1.5} size={24} />
        <p>Subscriptions</p>
      </Link>

      <Link
        to="/feed/you"
        className="flex items-center gap-5 px-4 py-3 rounded-lg hover:bg-surface-secondary"
      >
        <CircleUserRound strokeWidth={1.5} size={24} />
        <p>You</p>
      </Link>
    </nav>
  );
};

export default SidebarExpanded;
