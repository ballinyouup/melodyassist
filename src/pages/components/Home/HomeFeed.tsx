import { type User } from "@prisma/client";
import AudioPlayer from "./AudioPlayer";

interface IHomeFeed {
  volume: number;
  userAudios:
    | {
        id: string;
        author: User;
        title: string;
        content: string;
        createdAt: Date;
      }[]
    | undefined;
}

const HomeFeed: React.FC<IHomeFeed> = ({ volume, userAudios }) => {
  return (
    <div className="flex w-full flex-row items-start justify-center">
      <div className="relative h-[520px] w-full max-w-2xl gap-1 overflow-y-auto rounded-xl bg-base-300 p-1">
        {userAudios?.map((post) => {
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
        })}
      </div>
    </div>
  );
};

export default HomeFeed;
