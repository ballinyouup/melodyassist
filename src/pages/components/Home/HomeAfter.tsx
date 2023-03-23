import AudioPlayer from "./AudioPlayer";

interface IHomeAfter {
  volume: number;
}

const HomeAfter: React.FC<IHomeAfter> = ({ volume }) => {
  return (
    <>
      <AudioPlayer url="/seed-33877-output.mp3" title="33877" volume={volume} />
    </>
  );
};

export default HomeAfter;
