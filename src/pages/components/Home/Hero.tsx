import { useRouter } from "next/router";
import Logo from "../Navbar/Logo";
const Hero = () => {
  const router = useRouter();
  return (
    <>
      
      <div className="hero">
        <div className="hero-content flex w-full flex-col">
          <Logo theme="night" />
          <div className="flex max-w-2xl flex-col items-center justify-start p-8 text-center text-neutral-content sm:mt-20">
            <h1 className="text-7xl font-bold">
              Elevate Your Creative Workflow with AI
            </h1>
            <p className="py-6 text-xl">
              Access Free Audio Samples, Lyrics, and Cover Art to Create,
              Collaborate, and Share
            </p>
            <button
              className="btn-outline btn text-white"
              onClick={() => void router.push("/generate")}
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
