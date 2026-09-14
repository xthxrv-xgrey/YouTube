import HeaderLeft from "./HeaderLeft";
import HeaderCenter from "./HeaderCenter";
import HeaderRight from "./HeaderRight";

const Header = () => {
  return (
    <header className="bg-background h-16 flex flex-row  justify-between items-center px-5">
      <HeaderLeft />
      <HeaderCenter />
      <HeaderRight />
    </header>
  );
};

export default Header;
