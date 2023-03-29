import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import Image from "next/image";
interface IAudioPlayer {
  url: string;
  title?: string | undefined;
  volume: number;
  createdAt?: string;
  audioId: string;
}

const AudioPlayer: React.FC<IAudioPlayer> = ({
  url,
  title,
  volume,
  createdAt,
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
  const userData = api.account.getUserData.useQuery();
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
          <div className="flex w-full flex-row gap-2 rounded-xl bg-base-300 p-2 text-base-content sm:gap-4">
            <div className="flex h-16 flex-row">
              <Image
                src={userData.data?.image as string}
                alt="profile pic"
                width={68}
                height={10}
                className="min-w-[68px]"
              />
            </div>
            <div className="-mt-2 flex w-full flex-col py-2">
              <div className="flex h-full flex-row justify-between gap-1 sm:gap-2">
                <div className="flex w-full flex-row gap-2 sm:gap-4">
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
                        className="swap-off min-w-[40px]"
                        width={40}
                        height={40}
                      />
                    )}
                  </button>
                  <div className="flex h-fit w-full flex-col">
                    <span className="flex w-full flex-row justify-between text-xs font-medium leading-none">
                      <span className="h-full">
                        <span className="break-all text-sm max-[360px]:text-xs">
                          {userData.data?.userName}
                        </span>
                        <br />
                        <span className="max-[360px]:text-xs font-bold leading-none text-lg">
                          {title as string}
                        </span>
                      </span>
                      <div className="hidden flex-col text-end sm:flex">
                        <span className="text-xs leading-none">
                          {createdAt?.split(" ")[0]}
                        </span>

                        <span className="text-xs leading-none">
                          {createdAt?.split(" ")[1]}
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
                  <button
                    className="btn-xs btn h-fit w-fit rounded-none bg-black p-0"
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
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={audioRef.current ? `${audioRef.current.duration}` : "7.5"}
                value={currentTime}
                step={0.05}
                className="range range-xs w-4/5 sm:w-[90%]"
                onChange={handleTimeChange}
              />
              <audio ref={audioRef} preload="auto">
                <source src={url} />
              </audio>
              <div className="mt-1 flex flex-row justify-between">
                {audioRef.current &&
                  !Number.isNaN(audioRef.current.duration) && (
                    <>
                      <span>{Number(currentTime).toFixed(1)}</span>
                      <span className="mr-12">
                        {Number(audioRef.current.duration).toFixed(1)}
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
