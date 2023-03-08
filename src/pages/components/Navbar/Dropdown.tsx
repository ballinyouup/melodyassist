/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import type { FC } from "react";
import Logout from "./Logout";

const Dropdown: FC = () => {
  const [dropdown, setDropdown] = useState<boolean>(false);

  return (
    <div className="dropdown-end dropdown dropdown-bottom">
      <label tabIndex={0} className="swap-rotate swap btn-md btn-circle">
        <input type="checkbox" onChange={() => setDropdown(!dropdown)} />
        <svg
          className="swap-off fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
        </svg>
        <svg
          className="swap-on fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
        </svg>
      </label>
      {dropdown && (
        <ul
          tabIndex={0}
          className={`dropdown-content menu rounded-box menu-normal w-screen translate-x-1 bg-base-300 p-2 sm:w-52`}
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
      )}
    </div>
  );
};

export default Dropdown;
