import { type User } from "@prisma/client";
import AudioPlayer from "./AudioPlayer";
import { useState } from "react";
import Image from "next/image";
interface IBrowseFeed {
  userAudios:
    | {
        id: string;
        author: User;
        title: string;
        content: string;
        createdAt: Date;
      }[]
    | undefined;
  isLoading: boolean;
}

const BrowseFeed: React.FC<IBrowseFeed> = ({ userAudios, isLoading }) => {
  const [volume, setVolume] = useState<number>(80);
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };
  return (
    <>
      <div className="flex h-20 w-full flex-row items-center justify-center gap-4">
        <button onClick={() => setVolume(volume === 0 ? 70 : 0)}>
          {volume === 0 ? (
            <Image
              src="/volume-mute.png"
              alt="volume muted"
              className="w-7 invert"
              width={28}
              height={28}
            />
          ) : (
            <Image
              src="/audio.png"
              alt="audio button"
              className="w-8 invert"
              width={32}
              height={32}
            />
          )}
        </button>
        <div
          className="tooltip tooltip-bottom tooltip-primary w-4/5 max-w-md sm:w-full"
          data-tip={volume}
        >
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            className="range range-xs w-full"
            onChange={handleVolumeChange}
          />
        </div>
      </div>
      <div className="flex w-full flex-row items-start justify-center">
        <div className="relative h-[520px] w-full max-w-2xl gap-1 overflow-y-auto rounded-xl bg-base-300 p-1">
          {!isLoading ? (
            userAudios &&
            userAudios?.map((post) => {
              return (
                <div key={post.id}>
                  <AudioPlayer
                    url={post.content}
                    title={post.title}
                    createdAt={`${post.createdAt.toLocaleDateString()} ${post.createdAt.toLocaleTimeString()}`}
                    volume={volume}
                    audioId={post.id}
                    userName={post.author.userName}
                    userImage={post.author.image as string}
                    feed={true}
                  />
                </div>
              );
            })
          ) : (
            <div
              role="status"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <svg
                aria-hidden="true"
                className="inline h-12 w-12 animate-spin fill-white text-gray-200 dark:text-gray-600"
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
        </div>
      </div>
    </>
  );
};

export default BrowseFeed;
