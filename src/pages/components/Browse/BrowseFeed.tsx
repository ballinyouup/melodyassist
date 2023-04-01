import AudioPlayer from "../AudioPlayer";
import { useState } from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import LoadingSpinner from "../LoadingSpinner";

const BrowseFeed: React.FC = () => {
  const { data: userAudios, isLoading: feedLoading } =
    api.audio.getFeed.useQuery(undefined, {
      queryKey: ["audio.getFeed", undefined],
    });
  const { data: users, isLoading: userCountLoading } =
    api.account.getUserCount.useQuery(undefined, {
      queryKey: ["account.getUserCount", undefined],
    });
  const [volume, setVolume] = useState<number>(80);
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="stats w-full grid-flow-row justify-center border border-gray-500 border-opacity-20 p-5 text-center sm:w-fit sm:grid-flow-col">
          <div className="stat border-none">
            <div className="stat-title font-bold text-black text-opacity-80">
              Samples Uploaded
            </div>
            <div className="stat-value text-black">
              {!userCountLoading ? userAudios?.length : "0"}
            </div>
          </div>
          <div className="divider hidden h-4/5 sm:flex" />
          <div className="stat border-none">
            <div className="stat-title font-bold text-black">Total Users</div>
            <div className="stat-value text-black">
              {!userCountLoading ? users?.length : "0"}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden h-20 w-full flex-row items-center justify-center gap-4 sm:flex">
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
        <div
          id="browsefeed"
          className="relative h-[640px] w-full max-w-2xl gap-2 overflow-y-scroll border border-gray-500 bg-base-300"
        >
          {!feedLoading ? (
            userAudios &&
            userAudios?.map((post, index) => {
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
                  {index !== userAudios.length - 1 && (
                    <div className="mb-1.5 w-full border-b border-gray-500" />
                  )}
                </div>
              );
            })
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </>
  );
};

export default BrowseFeed;
