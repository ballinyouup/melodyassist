import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
/* eslint-disable @next/next/no-img-element */

interface IAudioPlayer {
  url: string;
  title?: string | undefined;
  volume: number;
  createdAt?: string;
  generatePage?: boolean;
  audioId: string;
}

const AudioPlayer: React.FC<IAudioPlayer> = ({
  url,
  title,
  volume,
  createdAt,
  generatePage = false,
  audioId,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { mutate: deleteAudio } = api.audio.deleteAudio.useMutation();
  const trpc = api.useContext();
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

  const handleDelete = (id: string) => {
    deleteAudio(id, {
      onError: () => toast.error("Error Deleting Audio"),
      onSuccess: () => {
        void trpc.audio.getAudio.invalidate();
        toast.success("Deleted Audio");
      },
    });
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  async function handleDownloadClick() {
    await fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title as string}`;
        link.click();
      });
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="flex w-screen justify-start sm:w-full">
          <div
            className={`flex w-full flex-row gap-4 rounded-xl bg-base-300 py-4 px-2 text-base-content ${
              generatePage ? "w-full" : "sm:w-96"
            }`}
          >
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
            <div className="-mt-2 flex w-full flex-col">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <span
                    className={`${
                      generatePage ? "text-md" : "text-xl"
                    } font-medium`}
                  >
                    {title as string}
                    {generatePage && (
                      <>
                        <br />
                        <span className="text-sm">{createdAt}</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex h-8 flex-col items-end gap-1">
                  <button
                    className="btn-xs btn h-8 w-fit"
                    onClick={() => void handleDownloadClick()}
                  >
                    <img
                      className="w-4"
                      src="/download-dark.png"
                      alt="download button"
                    />
                  </button>
                  <button className="btn-xs btn h-8 w-8 p-0"  onClick={() => handleDelete(audioId)}>
                      <img src="/delete.png" alt="delete" className="w-6 h-6 p-0 invert"/>
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={audioRef.current ? `${audioRef.current.duration}` : "7.5"}
                value={currentTime}
                step={0.05}
                className="range range-xs w-[90%]"
                onChange={handleTimeChange}
              />
              <audio ref={audioRef}>
                <source src={url} />
              </audio>
              <div className="flex flex-row justify-between mt-1">
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

export default AudioPlayer;
