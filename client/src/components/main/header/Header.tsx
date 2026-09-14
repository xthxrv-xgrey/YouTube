import HeaderLeft from "./HeaderLeft";
import HeaderCenter from "./HeaderCenter";
import HeaderRight from "./HeaderRight";

const Header = () => {
  return (
    <header className="bg-background h-16 flex items-center px-5">
      <HeaderLeft />

      <div className="flex-1 min-w-0">
        <HeaderCenter />
      </div>

      <HeaderRight />
    </header>
  );
};

export default Header;
