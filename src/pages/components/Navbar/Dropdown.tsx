/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import Logout from "./Logout";
import { useSession } from "next-auth/react";

const Dropdown: React.FC = () => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const { data: session } = useSession();
  if (!session) return <></>;
  return (
    <div className="dropdown-bottom dropdown-end dropdown">
      <label tabIndex={0} className="swap swap-rotate btn-circle object-cover">
        <input type="checkbox" onChange={() => setDropdown(!dropdown)} />
        <img
          className="h-10 w-10 rounded-full border border-black hover:brightness-[90%]"
          src={session?.user.image || ""}
          alt="profile image"
        />
      </label>

      {dropdown && (
        <ul
          tabIndex={0}
          className={`dropdown-content menu rounded-box menu-normal w-screen translate-x-1 bg-base-300 p-2 sm:w-52`}
        >
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          <li>
            <Link href="/settings">Settings</Link>
          </li>
          <li>
            <a>FAQ</a>
          </li>
          <li>
            <a>Contact</a>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
