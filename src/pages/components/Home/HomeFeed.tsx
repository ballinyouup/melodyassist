import { api } from "~/utils/api";
import AudioPlayer from "./AudioPlayer";

interface IHomeFeed {
  volume: number;
}

const HomeFeed: React.FC<IHomeFeed> = ({ volume }) => {
  const { data: userAudios } = api.audio.getAudio.useQuery();

  return (
    <div className="flex w-full flex-row items-start justify-center">
      <div className="relative h-[520px] max-w-2xl gap-1 overflow-y-auto rounded-xl bg-base-300 p-1 w-full">
        {(userAudios?.posts?.length as number) > 0 ? (
          userAudios?.posts.map((post) => {
            return (
              <div key={post.id}>
                <AudioPlayer
                  url={post.content}
                  title={post.title}
                  createdAt={`${post.createdAt.toLocaleDateString()} ${post.createdAt.toLocaleTimeString()}`}
                  volume={volume}
                  audioId={post.id}
                />
              </div>
            );
          })
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-neutral-content">
            <i>Empty</i>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeFeed;
