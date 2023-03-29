import Logo from "./Navbar/Logo";
import Dropdown from "./Navbar/Dropdown";
import LogIn from "./Navbar/LogIn";
import { useSession } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data, status } = useSession();

  if (data === null && status !== "loading") {
    return (
      <div className="navbar h-20 bg-base-100">
        <div className="navbar-start">
          <Logo />
        </div>
        <div className="navbar-end w-full gap-4">
          <LogIn />
        </div>
      </div>
    );
  }
  return (
    <div className="navbar h-20 bg-base-100">
      <div className="navbar-start">
        <Logo />
      </div>
      <div className="navbar-end w-full gap-4">
        {status === "loading" ? (
          <label
            tabIndex={0}
            className="swap swap-rotate btn-circle object-cover"
          >
            <div className="h-10 w-10 animate-pulse rounded-full border border-black bg-primary-content" />
          </label>
        ) : (
          <>
            <Dropdown />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
