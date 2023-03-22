import { useCallback, useEffect, useRef, useState } from "react";
/* eslint-disable @next/next/no-img-element */

interface IAudioPlayer {
  title?: string | undefined;
  desc?: string;
}

const AudioPlayerDisabled: React.FC<IAudioPlayer> = ({ title, desc }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const updateCurrentTime = useCallback(() => {
    setCurrentTime(audioRef.current?.currentTime as number);
    if (isPlaying) {
      requestAnimationFrame(updateCurrentTime);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
      requestAnimationFrame(updateCurrentTime);
    };
    const handlePause = () => setIsPlaying(false);

    audioRef.current?.addEventListener("play", handlePlay);
    audioRef.current?.addEventListener("pause", handlePause);
  }, [updateCurrentTime]);


  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="flex w-screen justify-start sm:w-96">
          <div className="flex w-full flex-row gap-4 rounded-2xl bg-base-100 p-3 text-base-content sm:w-96">
            <button
              className="btn h-12 w-12 rounded-full p-1"
            >
                <img
                  src="/close.png"
                  alt="disabled button"
                  className="w-6"
                />
            </button>
            <div className="-mt-2 flex w-full flex-col leading-none">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-medium line-through">
                    {desc ? desc : "Seed: "}
                    {title}
                  </span>
                </div>
              </div>
              <input
                disabled
                type="range"
                min="0"
                max={
                  audioRef.current
                    ? audioRef.current.duration
                    : "7.5"
                }
                value={currentTime}
                className="range range-xs"
                onChange={handleTimeChange}
              />
              <audio ref={audioRef}>
                <source src="" />
              </audio>
              <div className="flex flex-row justify-between">
                {audioRef.current &&
                  !Number.isNaN(audioRef.current.duration) && (
                    <>
                      <span>{Number(currentTime).toFixed(1)}</span>
                      <span>
                        {Number(audioRef.current.duration).toFixed(1)}
                      </span>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex w-full flex-col justify-start px-6 sm:w-3/5"></div>
      </div>
    </div>
  );
};

export default AudioPlayerDisabled;
