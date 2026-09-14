import HeaderLeft from "./HeaderLeft";
import HeaderCenter from "./HeaderCenter";
import HeaderRight from "./HeaderRight";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center bg-background/70 px-5 backdrop-blur-xl supports-backdrop-filter:bg-background/90">
      <HeaderLeft />

      <div className="min-w-0 flex-1">
        <HeaderCenter />
      </div>

      <HeaderRight />
    </header>
  );
};

export default Header;
