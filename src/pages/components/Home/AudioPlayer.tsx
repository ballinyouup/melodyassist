import { useCallback, useEffect, useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */

interface IAudioPlayer {
  url: string;
}

const AudioPlayer: React.FC<IAudioPlayer> = ({ url }) => {
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

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="flex w-3/5 justify-start gap-2 p-8">
          <button
            className="btn h-12 w-12 rounded-full p-1"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img
                src="/pause-dark.png"
                className="h-6 w-6"
                alt="play button"
              />
            ) : (
              <img src="/play-button-dark.png" alt="play button" />
            )}
          </button>
          <div className="flex flex-col leading-none">
            <span className="z-10">Ballinyouup</span>
            <span className="text-2xl font-medium">Piano Sample #35</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex w-3/5 flex-col justify-start px-6">
          <span>
            {Number(currentTime).toFixed(1)}/
            {Number(audioRef.current?.duration).toFixed(1)}
          </span>
          <div id="waveform"></div>
          <input
            type="range"
            min="0"
            max={audioRef.current?.duration ?? 100}
            value={currentTime}
            className="range range-xs"
            onChange={handleTimeChange}
          />
          <audio ref={audioRef}>
            <source src={url} />
          </audio>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
