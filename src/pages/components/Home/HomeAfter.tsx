import AudioPlayer from "./AudioPlayer";

interface IHomeAfter {
  volume: number;
}

const HomeAfter: React.FC<IHomeAfter> = ({ volume }) => {
  return (
    <>
      <AudioPlayer url="/Seed-33877-output.mp3" title="33877" volume={volume} />
      <AudioPlayer url="/Seed-61365-output.mp3" title="61365" volume={volume} />
      <AudioPlayer url="/Seed-46452-output.mp3" title="46452" volume={volume} />
    </>
  );
};

export default HomeAfter;
