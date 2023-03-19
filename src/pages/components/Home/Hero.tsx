import { useRouter } from "next/router";
import Logo from "../Navbar/Logo";

const Hero = () => {
  const router = useRouter();
  return (
    <>
      <div className="hero">
        <div className="hero-content flex flex-col w-full">
          <Logo theme="night" />
          <hr className="w-full text-white"/>
          <div className="flex max-w-md flex-col items-center justify-start text-center text-neutral-content mt-20">
            <h1 className="text-7xl font-bold">
              Elevate Your Creative Workflow with AI
            </h1>
            <p className="py-6 text-xl">
              Access Free Audio Samples, Lyrics, and Cover Art to Create,
              Collaborate, and Share
            </p>
            <button
              className="btn-outline btn text-white"
              onClick={() => void router.push("/profile")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
