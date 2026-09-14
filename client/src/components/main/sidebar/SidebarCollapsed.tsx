import { CircleUserRound, Film, House, TvMinimalPlay } from "lucide-react";
import { Link } from "react-router";

const SidebarCollapsed = () => {
  return (
    <nav className="h-full w-20 flex flex-col justify-start items-center py-5">
      <Link
        to="/"
        className="flex flex-col justify-center items-center gap-2 p-4 rounded hover:bg-surface-secondary"
      >
        <House strokeWidth={1.5} />
        <p className="text-xs">Home</p>
      </Link>

      <Link
        to="/shorts"
        className="flex flex-col justify-center items-center gap-2 p-4 rounded hover:bg-surface-secondary"
      >
        <Film strokeWidth={1.5} />
        <p className="text-xs">Shorts</p>
      </Link>

      <Link
        to="/feed/subscriptions"
        className="flex flex-col justify-center items-center gap-2 p-4 rounded hover:bg-surface-secondary"
      >
        <TvMinimalPlay strokeWidth={1.5} />
        <p className="text-xs">Subscriptions</p>
      </Link>

      <Link
        to="/feed/you"
        className="flex flex-col justify-center items-center gap-2 p-4 rounded hover:bg-surface-secondary"
      >
        <CircleUserRound strokeWidth={1.5} />
        <p className="text-xs">You</p>
      </Link>
    </nav>
  );
};

export default SidebarCollapsed;
