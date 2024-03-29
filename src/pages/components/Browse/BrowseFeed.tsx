import AudioPlayer from "../AudioPlayer";
import { useState } from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import LoadingSpinner from "../LoadingSpinner";
import Stats from "../Home/Stats";

const BrowseFeed: React.FC = () => {
  const { data: userAudios, isLoading: feedLoading } =
    api.audio.getFeed.useQuery();
  const [volume, setVolume] = useState<number>(80);
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };
  return (
    <div className="h-full">
      <Stats />
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
          className="h-full w-full max-w-2xl gap-2 border border-gray-500 bg-base-300"
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
    </div>
  );
};

export default BrowseFeed;
