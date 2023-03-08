import { useEffect, useState } from "react";
import type { FC, ReactNode } from "react";
import Navbar from "./Navbar";

interface ILayout {
  children: ReactNode;
}


const Layout: FC<ILayout> = ({ children }) => {
  
  const [theme, setTheme] = useState<string>("winter");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleToggle = () => {
    const newTheme = theme === "winter" ? "night" : "winter";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <Navbar handleToggle={handleToggle} />
      <main>{children}</main>
    </>
  );
};

export default Layout;
