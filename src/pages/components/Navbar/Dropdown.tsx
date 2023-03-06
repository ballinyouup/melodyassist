import { useState } from "react";
import type { FC } from "react";

export const Dropdown: FC = () => {
  const [dropdown, setDropdown] = useState<boolean>(false);

  return (
    <div className="dropdown-end dropdown">
      <button
        className="btn-ghost btn-square btn"
        onClick={() => setDropdown(!dropdown)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
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
            <a>Account</a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a>FAQ</a>
          </li>
          <li>
            <a>Contact</a>
          </li>
        </ul>
      ) : null}
    </div>
  );
};
