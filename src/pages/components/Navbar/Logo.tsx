/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

interface ILogo {
  theme: string;
}

const Logo: React.FC<ILogo> = ({ theme }) => {
  return (
    <div className="self-start">
      <Link href="/" className="btn-ghost btn h-14 normal-case p-0">
        {theme === "winter" ? (
          <>
            <img src="/logo-light.png" className="w-14 p-1" alt="logo-light" />
            <span className="hidden font-poppins text-black sm:flex text-lg lg:text-2xl">
              Melody Assist
            </span>
          </>
        ) : (
          <>
            <img src="/logo-dark.png" className="w-14 p-1" alt="logo-dark" />
            <span className="hidden font-poppins text-white sm:flex text-lg lg:text-2xl">
              Melody Assist
            </span>
          </>
        )}
      </Link>
    </div>
  );
};

export default Logo;
