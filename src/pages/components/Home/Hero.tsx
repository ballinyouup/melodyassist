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
            <div className="relative flex flex-row items-center gap-4">
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
                  className="range range-xs absolute top-32 -right-16 h-4 w-40 -rotate-90 z-10"
                  onChange={handleVolumeChange}
                />
              )}
            </div>
          </div>
          <div className="relative flex h-96 w-full flex-col items-center justify-center overflow-hidden bg-base-100 p-8 text-center text-white sm:mt-20">
            <img
              className="absolute -top-40 sm:max-w-5xl min-w-[600px] min-h-[600px] z-0 w-full mix-blend-screen brightness-[10%]"
              src="/home-image.png"
              alt="music producer looking at pc"
            />
            <h1 className="z-10 max-w-2xl text-3xl font-bold sm:text-6xl">
              Elevate Your Creative Workflow with AI
            </h1>
            <p className="z-10 max-w-2xl py-6 sm:text-xl">
              Access Free Audio Samples to Create, Collaborate, and Share
            </p>
            <button
              className="btn-outline btn z-10 text-white"
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
