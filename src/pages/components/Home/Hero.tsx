import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
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
          <div className="relative flex h-fit w-full flex-col items-center justify-center overflow-clip p-8 text-center text-black sm:mt-20 sm:h-96">
            <h1 className="z-10 max-w-2xl text-3xl font-bold sm:text-6xl">
              Elevate Your Creative Workflow with AI
            </h1>
            <p className="z-10 max-w-2xl py-6 sm:text-xl">
              Access Free Audio Samples to Create, Collaborate, and Share
            </p>
            <div className="flex flex-row gap-6">
              <button
                className="btn-outline btn z-10 text-black"
                onClick={() => void handleSignIn()}
              >
                Get Started
              </button>
              <Link href="/browse" className="btn-outline btn z-10 text-black">
                Browse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
