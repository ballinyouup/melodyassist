import AudioPlayer from "./AudioPlayer";

interface IHomeBefore {
  volume: number;
}

const HomeBefore: React.FC<IHomeBefore> = ({ volume }) => {
  return (
    <>
      <AudioPlayer
        audioId="33878"
        url="/Seed-33877_.mp3"
        title="Seed: 33877"
        volume={volume}
      />
      <AudioPlayer
        audioId="61366"
        url="/Seed-61365_.mp3"
        title="Seed: 61365"
        volume={volume}
      />
      <AudioPlayer
        audioId="46453"
        url="/Seed-46452_.mp3"
        title="Seed: 46452"
        volume={volume}
      />
    </>
  );
};

export default HomeBefore;
