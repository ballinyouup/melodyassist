import type { FC } from "react";
import Logo from "./Navbar/Logo";
import Search from "./Navbar/Search";
import Dropdown from "./Navbar/Dropdown";
import ToggleDark from "./Navbar/ToggleDark";
import { signIn, signOut, useSession } from "next-auth/react";
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
      <div className="navbar-end gap-8 ">
        <Search />
        <ToggleDark handleToggle={handleToggle} />
        {session ? (
          <>
            <button
              className="btn rounded-md p-3 text-white"
              onClick={() => void signOut()}
            >
              Log Out
            </button>
            <Dropdown />
          </>
        ) : (
          <button
            className="btn rounded-md p-3 text-white"
            onClick={() => void signIn()}
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
