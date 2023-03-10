import { useRouter } from "next/router";
const Hero = () => {
  const router = useRouter();
  return (
    <div className="hero h-96 bg-base-200">
      <div className="hero-content">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            Elevate Your Creative Workflow with AI
          </h1>
          <p className="py-6">
            Access Free Audio Samples, Lyrics, and Cover Art to Create,
            Collaborate, and Share
          </p>
          <button
            className="btn"
            onClick={() => void router.push("/profile")}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
