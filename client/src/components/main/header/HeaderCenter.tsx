import { Mic } from "lucide-react";

const HeaderCenter = () => {
  return (
    <div className="flex flex-row justify-center items-center gap-5">
      <input
        type="text"
        className="bg-surface border border-border w-150 h-10 rounded-full px-4"
        placeholder="Search"
      />
      <Mic className="w-10 h-10 p-2 rounded-full bg-surface-secondary cursor-pointer" />
    </div>
  );
};

export default HeaderCenter;
