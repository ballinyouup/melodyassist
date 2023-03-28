import AudioPlayer from "./AudioPlayer";

interface IHomeAfter {
  volume: number;
}

const HomeAfter: React.FC<IHomeAfter> = ({ volume }) => {
  return (
    <>
      <AudioPlayer audioId="33877" url="/seed-33877-output.mp3" title="Seed: 33877" volume={volume} />
      <AudioPlayer audioId="61365" url="/Seed-61365-output.mp3" title="Seed: 61365" volume={volume} />
      <AudioPlayer audioId="46452" url="/seed-46452-output.mp3" title="Seed: 46452" volume={volume} />
    </>
  );
};

export default HomeAfter;
