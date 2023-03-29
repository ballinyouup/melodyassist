import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
const Hero: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const handleSignIn = async () => {
    if (session) {
      await router.push("/generate");
    } else {
      void signIn(undefined, { redirect: true, callbackUrl: "/generate" });
    }
  };

  return (
    <>
      <div className="hero">
        <div className="hero-content w-full flex-col object-cover p-0 sm:-mt-20">
          <div className="relative flex h-fit w-full flex-col items-center justify-center overflow-clip bg-black p-8 text-center text-white sm:mt-20 sm:h-96">
            <Image
              className="absolute -top-40 z-0 min-h-[600px] w-full min-w-[600px] mix-blend-screen brightness-[10%] sm:max-w-5xl"
              src="/home-image.png"
              alt="music producer looking at pc"
              width={600}
              height={600}
              priority
            />
            <h1 className="z-10 max-w-2xl text-3xl font-bold sm:text-6xl">
              Elevate Your Creative Workflow with AI
            </h1>
            <p className="z-10 max-w-2xl py-6 sm:text-xl">
              Access Free Audio Samples to Create, Collaborate, and Share
            </p>
            <button
              className="btn-outline btn z-10 border-white text-white hover:bg-white hover:text-black"
              onClick={() => void handleSignIn()}
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
