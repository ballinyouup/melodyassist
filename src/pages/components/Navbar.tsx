import type { FC } from "react";
import Logo from "./Navbar/Logo";
import Dropdown from "./Navbar/Dropdown";
import ToggleDark from "./Navbar/ToggleDark";
import LogIn from "./Navbar/LogIn";
import { useSession } from "next-auth/react";

interface INavbar {
  handleToggle: () => void;
}

const Navbar: FC<INavbar> = ({ handleToggle }) => {
  const { status } = useSession();

  return (
    <div className={`navbar bg-base-100`}>
      <div className="navbar-start">
        <Logo />
      </div>
      <div className="navbar-end w-full gap-4">
        <ToggleDark handleToggle={handleToggle} />
        {status === "loading" && (
          <label
            tabIndex={0}
            className="swap-rotate swap btn-circle object-cover"
          >
            <div className="h-10 w-10 animate-pulse rounded-full border border-black bg-primary-content" />
          </label>
        )}
        {status === "authenticated" && (
          <>
            <Dropdown />
          </>
        )}
        {status === "unauthenticated" && <LogIn />}
      </div>
    </div>
  );
};

export default Navbar;
