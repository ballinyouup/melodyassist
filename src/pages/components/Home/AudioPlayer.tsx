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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { mutate: deleteAudio } = api.audio.deleteAudio.useMutation({
    onMutate: () => setDeleteLoading(true),
    onError: () => toast.error("Error Deleting Audio"),
    onSuccess: async () => {
      await trpc.audio.getAudio.invalidate();
      toast.success("Deleted Audio");
      setDeleteLoading(false);
    },
  });
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
    setDeleteLoading(true);
    deleteAudio(id);
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
                  <button
                    className="btn-xs btn h-8 w-8 p-0"
                    onClick={() => handleDelete(audioId)}
                    disabled={deleteLoading}
                  >
                    {!deleteLoading ? (
                      <img
                        src="/delete.png"
                        alt="delete"
                        className="h-6 w-6 p-0 invert"
                      />
                    ) : (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="inline h-3 w-3 animate-spin fill-white text-gray-200 dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    )}
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
              <div className="mt-1 flex flex-row justify-between">
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
