/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import Hero from "./components/Home/Hero";
import { api } from "~/utils/api";
import AudioPlayer from "./components/Home/AudioPlayer";
import Footer from "./components/Footer";
import { useState } from "react";

const Home: NextPage = () => {
  const [volume, setVolume] = useState<number>(80);
  const [showExtra, setShowExtra] = useState<boolean>(false);
  const userData = api.account.getUserData.useQuery();

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };
  return (
    <div>
      <Head>
        <title>Melody Assist</title>
        <meta name="description" content="Level up your Music with AI" />
        {userData.data?.theme === "winter" ? (
          <link rel="icon" href="/logo-dark.png" />
        ) : (
          <link rel="icon" href="/logo-light.png" />
        )}
      </Head>
      <main>
        <Hero volume={volume} handleVolumeChange={handleVolumeChange} />
        <div className="flex w-full flex-col items-center justify-center">
          <video
            src=""
            className="w-4/5 rounded-2xl sm:w-2/3 lg:w-1/2"
            controls
          ></video>
          <div className="stats p-5 shadow grid-flow-row sm:grid-flow-col w-full sm:w-fit justify-center">
            <div className="stat border-none">
              <div className="stat-title">Statistic #1</div>
              <div className="stat-value">0,000</div>
            </div>
            <div className="stat border-none">
              <div className="stat-title">Statistic #2</div>
              <div className="stat-value">0,000</div>
            </div>
            <div className="stat border-none">
              <div className="stat-title">Statistic #3</div>
              <div className="stat-value">0,000</div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row flex-wrap justify-center gap-2">
          <div className="flex w-full flex-col flex-wrap justify-center gap-2 sm:w-4/5 sm:flex-row">
            <AudioPlayer url="/Seed-42573_.mp3" title="42573" volume={volume} />
            <AudioPlayer url="/Seed-61365_.mp3" title="61365" volume={volume} />
            <AudioPlayer url="/Seed-36543_.mp3" title="36543" volume={volume} />
            <AudioPlayer url="/Seed-59440_.mp3" title="59440" volume={volume} />
            <AudioPlayer url="/Seed-46452_.mp3" title="46452" volume={volume} />
            <AudioPlayer url="/Seed-42573_.mp3" title="42573" volume={volume} />
            <AudioPlayer url="/Seed-61365_.mp3" title="61365" volume={volume} />
            <AudioPlayer url="/Seed-36543_.mp3" title="36543" volume={volume} />
            <AudioPlayer url="/Seed-59440_.mp3" title="59440" volume={volume} />
          </div>
        </div>
        <div className="flex justify-center p-6">
          <button
            className="btn-outline btn text-white"
            onClick={() => setShowExtra(!showExtra)}
          >
            Show Extras
          </button>
        </div>
        {showExtra && (
          <div className="flex w-full flex-row flex-wrap justify-center gap-2">
            <div className="flex w-full flex-col flex-wrap justify-center gap-2 sm:w-4/5 sm:flex-row">
              <AudioPlayer url="/out.mp3" desc="Extras #1" volume={volume} />
              <AudioPlayer url="/out(1).mp3" desc="Extras #2" volume={volume} />
              <AudioPlayer url="/out(2).mp3" desc="Extras #3" volume={volume} />
              <AudioPlayer url="/out(3).mp3" desc="Extras #4" volume={volume} />
              <AudioPlayer url="/out(4).mp3" desc="Extras #5" volume={volume} />
              <AudioPlayer url="/out(5).mp3" desc="Extras #6" volume={volume} />
            </div>
          </div>
        )}
      </main>
      <div className="flex justify-center">
        <div className="mt-20 flex w-full max-w-7xl flex-col items-start justify-center">
          <Footer theme="night"/>
        </div>
      </div>
    </div>
  );
};

export default Home;
