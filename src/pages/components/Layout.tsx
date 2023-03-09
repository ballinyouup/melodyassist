import type { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface ILayout {
  children: ReactNode;
}


const Layout: FC<ILayout> = ({ children }) => {

  

  return (
    <>
      <Toaster />
      <main>{children}</main>
    </>
  );
};

export default Layout;

