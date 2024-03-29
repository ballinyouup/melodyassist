/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import Image from "next/image";
interface IAudioPlayer {
  url: string;
  title?: string | undefined;
  volume: number;
  createdAt?: string;
  audioId: string;
  userName: string;
  userImage: string;
  feed?: boolean;
}

const AudioPlayer: React.FC<IAudioPlayer> = ({
  url,
  title,
  volume,
  createdAt,
  audioId,
  userName,
  userImage,
  feed = false,
}) => {
  const [audio] = useState(new Audio(url));
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
    if (audio) {
      isPlaying ? void audio.pause() : void audio.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (audio) {
      audio.currentTime = newTime;
    }
  };

  const handleDelete = (id: string) => {
    setDeleteLoading(true);
    deleteAudio(id);
  };

  const updateCurrentTime = useCallback(() => {
    setCurrentTime(audio.currentTime);
    if (isPlaying) {
      requestAnimationFrame(updateCurrentTime);
    }
  }, [audio, isPlaying]);

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
      requestAnimationFrame(updateCurrentTime);
    };
    const handlePause = () => setIsPlaying(false);
    if (audio) {
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
    }
  }, [audio, updateCurrentTime]);

  useEffect(() => {
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [audio, volume]);

  async function handleDownloadClick() {
    await fetch(url, { mode: "no-cors" })
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
    <div className="flex flex-col p-1.5 pb-0">
      <div className="flex justify-center">
        <div className="flex w-screen justify-start sm:w-full">
          <div className="flex w-full flex-row gap-2 bg-base-300 text-base-content">
            <div className="flex h-16 flex-row">
              <img
                src={userImage}
                alt="profile pic"
                width={68}
                height={10}
                className="min-w-[68px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="-mt-2 flex w-full flex-col py-2">
              <div className="flex h-12 flex-row justify-between gap-1 max-[320px]:h-full sm:gap-2">
                <div className="flex w-full flex-row gap-2">
                  <button
                    className="btn h-10 min-h-0 w-10 rounded-full object-cover p-0"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Image
                        src="/pause-dark.png"
                        className="swap-on min-w-[24px]"
                        alt="play button"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <Image
                        src="/play-button-dark.png"
                        alt="play button"
                        className="swap-off min-w-[36px]"
                        width={36}
                        height={36}
                      />
                    )}
                  </button>
                  <div className="flex h-fit w-full flex-col">
                    <span className="flex w-full flex-row justify-between text-xs font-medium leading-none">
                      <span className="h-full">
                        <span className="break-all text-sm max-[400px]:text-xs">
                          {userName}
                        </span>
                        <br />
                        <span className="text-lg font-bold leading-none max-[400px]:text-xs">
                          {title as string}
                        </span>
                      </span>
                      <div className="hidden flex-col text-end sm:flex">
                        <span className="text-xs leading-none">
                          {createdAt && createdAt.split(" ")[0]}
                        </span>

                        <span className="text-xs leading-none">
                          {createdAt && createdAt.split(" ")[1]}
                        </span>
                      </div>
                    </span>
                  </div>
                </div>
                <div className="flex h-8 flex-col items-end gap-1">
                  <button
                    className="btn-xs btn h-8 w-fit rounded-none bg-black"
                    onClick={() => void handleDownloadClick()}
                  >
                    <Image
                      src="/download-dark.png"
                      alt="download button"
                      width={16}
                      height={16}
                      className="min-w-[16px]"
                    />
                  </button>
                  {!feed && (
                    <button
                      className="btn-xs btn h-8 w-8 rounded-none bg-black p-0"
                      onClick={() => handleDelete(audioId)}
                      disabled={deleteLoading}
                    >
                      {!deleteLoading ? (
                        <Image
                          src="/delete.png"
                          alt="delete"
                          className="min-w-[32px] p-0 invert"
                          width={32}
                          height={32}
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
                  )}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={audio ? `${audio.duration}` : "7.5"}
                value={currentTime}
                step={0.05}
                className="range range-xs w-4/5 sm:range-sm sm:w-[90%]"
                onChange={handleTimeChange}
              />
              <div className="mt-1 flex flex-row justify-between">
                {audio && !Number.isNaN(audio.duration) && (
                  <>
                    <span>{Number(currentTime).toFixed(1)}</span>
                    <span className="mr-12">
                      {Number(audio.duration).toFixed(1)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
