import { Menu } from "lucide-react";

const HeaderLeft = () => {
  return (
    <div className="flex flex-row justify-center items-center gap-5">
      <Menu className="w-10 h-10 p-2 rounded-full hover:bg-surface-secondary cursor-pointer" />
      <div>LOGO</div>
    </div>
  );
};

export default HeaderLeft;
