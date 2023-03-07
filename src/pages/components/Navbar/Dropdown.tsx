/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import type { FC } from "react";
import Logout from "./Logout";


const Dropdown: FC = () => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const { data: sessionData } = useSession();

  return (
    <div className="dropdown-end dropdown">
      <button
        className="btn-square btn-circle btn"
        onClick={() => setDropdown(!dropdown)}
      >
        <img
          className="w-12 rounded-full border-black"
          src={sessionData?.user.image || ""}
          alt="profile image"
        />
      </button>
      {dropdown ? (
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box menu-normal mt-5 w-52 bg-base-300 p-2 shadow"
        >
          <li>
            <a>Home</a>
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
      ) : null}
    </div>
  );
};

export default Dropdown;
