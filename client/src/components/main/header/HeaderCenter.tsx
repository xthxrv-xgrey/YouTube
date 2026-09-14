import { Mic } from "lucide-react";

const HeaderCenter = () => {
  return (
    <div className="hidden sm:flex w-full min-w-0 flex-row items-center justify-center gap-5 px-10">
      <input
        type="text"
        className="bg-surface border border-border w-full max-w-150 h-10 rounded-full px-4"
        placeholder="Search"
      />
      <Mic className="w-10 h-10 p-2 rounded-full bg-surface-secondary cursor-pointer" />
    </div>
  );
};

export default HeaderCenter;
