import { useEffect, useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */
const AudioProfile: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const togglePlay = () => {
    isPlaying ? void audioRef.current?.pause() : void audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current?.currentTime as number);
    };

    audioRef.current?.addEventListener("play", handlePlay);
    audioRef.current?.addEventListener("pause", handlePause);
    audioRef.current?.addEventListener("timeupdate", handleTimeUpdate);
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="flex w-3/5 justify-start gap-2 p-8">
          <button
            className="btn h-12 w-12 rounded-full p-1"
            onClick={togglePlay}
          >
            <img src="/play-button-dark.png" alt="play button" />
          </button>
          <div className="flex flex-col leading-none">
            <span className="z-10 text-neutral">Ballinyouup</span>
            <span className="text-2xl font-medium text-neutral">
              Piano Sample #35
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex w-3/5 justify-start px-6">
          <input
            type="range"
            min="0"
            max="100"
            value={currentTime}
            className="range range-xs"
            onChange={handleTimeChange}
          />
          <audio ref={audioRef}>
            <source src="http://cld3097web.audiovideoweb.com/va90web25003/companions/Foundations%20of%20Rock/13.01.mp3" />
          </audio>
        </div>
      </div>
    </div>
  );
};

export default AudioProfile;
