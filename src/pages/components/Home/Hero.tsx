/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import Logo from "../Navbar/Logo";
import { useState } from "react";

interface IHero {
  volume: number;
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Hero: React.FC<IHero> = ({ volume, handleVolumeChange }) => {
  const router = useRouter();
  const [openVolume, setOpenVolume] = useState<boolean>(false);
  return (
    <>
      <div className="hero">
        <div className="hero-content w-full flex-col">
          <div className="flex w-full flex-row items-center justify-between">
            <Logo theme="night" />
            <div className="flex flex-row items-center gap-4 relative">
              <button onClick={() => setOpenVolume(!openVolume)}>
                {volume === 0 ? (
                  <img
                    src="volume-mute.png"
                    alt="volume muted"
                    className="w-7"
                  />
                ) : (
                  <img src="audio.png" alt="audio button" className="w-8" />
                )}
              </button>
              {openVolume && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  className="range range-xs w-40 absolute -rotate-90 top-32 -right-16 h-4"
                  onChange={handleVolumeChange}
                />
              )}
            </div>
          </div>

          <div className="flex max-w-2xl flex-col items-center justify-start p-8 text-center text-neutral-content sm:mt-20">
            <h1 className="sm:text-7xl font-bold text-3xl">
              Elevate Your Creative Workflow with AI
            </h1>
            <p className="py-6 sm:text-xl">
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
