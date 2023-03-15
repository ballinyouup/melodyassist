/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

interface ILogo {
  theme: string;
}

const Logo: React.FC<ILogo> = ({ theme }) => {
  return (
    <>
      <Link href="/" className="btn-ghost btn text-xl normal-case h-14">
        {theme === "winter" ? (
          <img src="/logo-light.png" className="w-14 p-1" alt="logo-light" />
        ) : (
          <img src="/logo-dark.png" className="w-14 p-1" alt="logo-dark" />
        )}
      </Link>
    </>
  );
};

export default Logo;
