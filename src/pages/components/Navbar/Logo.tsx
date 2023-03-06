import Link from "next/link";
import type { FC } from "react";

const Logo: FC = () => {
  return (
    <>
      <Link href="/" className="btn-ghost btn text-xl normal-case">
        Melody Assist
      </Link>
    </>
  );
};

export default Logo;
