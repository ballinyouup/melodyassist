import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
/* eslint-disable @next/next/no-img-element */

interface IAudioPlayer {
  url: string;
}

const AudioPlayer: React.FC<IAudioPlayer> = ({ url }) => {
  const userData = api.account.getUserData.useQuery(undefined, {
    retry: false,
  });
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

  function handleDownloadClick() {
    const audioElement = audioRef.current;
    const source = audioElement?.src;
    const fileName = "audio.mp3";
    const link = document.createElement("a");
    link.download = fileName;
    link.href = source as string;
    link.click();
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="flex justify-start p-2 sm:w-3/5">
          <div className="flex w-full flex-row gap-4 rounded-2xl bg-primary-content p-6">
            <button
              className="btn h-12 w-12 rounded-full p-1"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <img
                  src="/pause-dark.png"
                  className="swap-on h-6 w-6"
                  alt="play button"
                />
              ) : (
                <img
                  src="/play-button-dark.png"
                  alt="play button"
                  className="swap-off"
                />
              )}
            </button>
            <div className="-mt-2 flex w-full flex-col leading-none">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <span className="z-10">Ballinyouup</span>
                  <span className="text-xl font-medium">Piano Sample #35</span>
                </div>
                <div className="flex h-8 flex-col items-end">
                  <button
                    className="btn-ghost btn-xs btn h-8 w-fit"
                    onClick={handleDownloadClick}
                  >
                    {userData.data?.theme === "winter" ? (
                      <img
                        className="w-4"
                        src="/download-light.png"
                        alt="download button"
                      />
                    ) : (
                      <img
                        className="w-4"
                        src="/download-dark.png"
                        alt="download button"
                      />
                    )}
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={audioRef.current?.duration ?? "100"}
                value={currentTime}
                className="range range-xs"
                onChange={handleTimeChange}
              />
              <audio ref={audioRef}>
                <source src={url} />
              </audio>
              <div className="flex flex-row justify-between">
                <span>{Number(currentTime).toFixed(1)}</span>
                <span>
                  {Number(audioRef.current?.duration ?? "0").toFixed(1)}
                </span>
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

export default AudioPlayer;
