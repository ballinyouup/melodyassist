import type { FC } from "react";
import Logo from "./Navbar/Logo";
import Dropdown from "./Navbar/Dropdown";
import ToggleDark from "./Navbar/ToggleDark";
import { useSession } from "next-auth/react";
import LogIn from "./Navbar/LogIn";
interface INavbar {
  handleToggle: () => void;
}
const Navbar: FC<INavbar> = ({ handleToggle}) => {
  const { data: session } = useSession();
  return (
    <div
      className={`navbar bg-base-100`}
    >
      <div className="navbar-start">
        <Logo />
      </div>
      <div className="navbar-end w-full gap-4">
        <ToggleDark handleToggle={handleToggle} />
        {session ? (
          <>
            <Dropdown />
          </>
        ) : (
          <LogIn />
        )}
      </div>
    </div>
  );
};

export default Navbar;
