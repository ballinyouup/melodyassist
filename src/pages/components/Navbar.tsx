import type { FC } from "react";
import Logo from "./Navbar/Logo";
import Dropdown from "./Navbar/Dropdown";
import ToggleDark from "./Navbar/ToggleDark";
import { useSession } from "next-auth/react";
import LogIn from "./Navbar/LogIn";
interface INavbar {
  handleToggle: () => void;
  theme: string;
}
const Navbar: FC<INavbar> = ({ handleToggle, theme }) => {
  const { data: session } = useSession();
  return (
    <div
      className={`navbar bg-base-100 p-3 shadow-md ${
        theme === "winter" ? "shadow-gray" : "shadow-[#0f0f0f]"
      }`}
    >
      <div className="navbar-start">
        <Logo />
      </div>
      <div className="navbar-end w-full gap-6">
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
