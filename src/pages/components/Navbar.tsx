import type { FC } from "react";
import Logo from "./Navbar/Logo";
import Search from "./Navbar/Search";
import { Dropdown } from "./Navbar/Dropdown";
import { ToggleDark } from "./Navbar/ToggleDark";
interface INavbar {
  handleToggle: () => void;
  theme: string;
}
const Navbar: FC<INavbar> = ({ handleToggle, theme }) => {
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
        <Dropdown />
      </div>
    </div>
  );
};

export default Navbar;
