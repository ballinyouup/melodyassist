import AudioPlayer from "./AudioPlayer";

interface IHomeBefore{
    volume: number;
}

const HomeBefore: React.FC<IHomeBefore> = ({volume}) => {
  return (
    <>
      <AudioPlayer url="/Seed-33877_.mp3" title="33877" volume={volume} />
      <AudioPlayer url="/Seed-61365_.mp3" title="61365" volume={volume} />
      <AudioPlayer url="/Seed-46452_.mp3" title="46452" volume={volume} />
    </>
  );
};

export default HomeBefore;
