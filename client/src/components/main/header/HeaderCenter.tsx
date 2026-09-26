import { Mic, Search } from "lucide-react";

const HeaderCenter = () => {
  return (
    <div className="hidden sm:flex w-full min-w-0 items-center justify-center gap-4 px-6">
      {/* Search */}
      <div className="flex w-full max-w-150 h-10 rounded-full overflow-hidden border border-border bg-surface">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 min-w-0 bg-transparent px-4 outline-none text-sm"
        />

        <button
          type="button"
          className="w-16 flex items-center justify-center border-l border-border bg-surface-secondary hover:bg-surface-secondary/80"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Mic */}
      <button
        type="button"
        className="shrink-0 w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center hover:bg-surface-secondary/80"
      >
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeaderCenter;
