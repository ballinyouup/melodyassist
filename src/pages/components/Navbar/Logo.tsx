/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <div className="self-start">
      <Link href="/" className="btn-ghost btn h-14 px-2 normal-case">
        <>
          <img src="/logo-light.png" className="w-14 p-1" alt="logo-light" />
          <span
            className={`hidden text-lg font-bold text-black sm:flex lg:text-2xl`}
          >
            Melody Assist
          </span>
        </>
      </Link>
    </div>
  );
};

export default Logo;
