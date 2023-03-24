/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import Hero from "./components/Home/Hero";
import { api } from "~/utils/api";
import AudioPlayer from "./components/Home/AudioPlayer";
import Footer from "./components/Footer";
import { useState } from "react";
import HomeBefore from "./components/Home/HomeBefore";
import HomeAfter from "./components/Home/HomeAfter";

const Home: NextPage = () => {
  const [volume, setVolume] = useState<number>(80);
  const [showExtra, setShowExtra] = useState<boolean>(false);
  const userData = api.account.getUserData.useQuery();
  const [active, setActive] = useState<boolean>(false);
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
          <div className="stats w-full grid-flow-row justify-center p-5 text-center shadow sm:w-fit sm:grid-flow-col">
            <div className="stat border-none">
              <div className="stat-title">Drum Loops Generated</div>
              <div className="stat-value">9,999</div>
            </div>
            <div className="divider h-4/5 hidden sm:flex" />
            <div className="stat border-none">
              <div className="stat-title">Total Users</div>
              <div className="stat-value">9,999</div>
            </div>
          </div>
        </div>
        <div className="mb-5 flex flex-row items-center justify-center">
          <div className="tabs tabs-boxed w-fit gap-1 bg-neutral p-2">
            <button
              onClick={() => (active ? setActive(!active) : null)}
              className={`tab h-10 font-poppins text-lg font-semibold ${
                !active ? "tab-active" : ""
              }`}
            >
              Before
            </button>
            <button
              onClick={() => (!active ? setActive(!active) : null)}
              className={`tab h-10 font-poppins text-lg font-semibold ${
                active ? "tab-active" : ""
              }`}
            >
              After
            </button>
          </div>
        </div>
        <div className="flex w-full flex-row flex-wrap justify-center gap-2">
          <div className="flex w-full flex-col flex-wrap justify-center gap-2 sm:w-4/5 sm:flex-row">
            {!active ? (
              <HomeBefore volume={volume} />
            ) : (
              <HomeAfter volume={volume} />
            )}
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
          <Footer theme="night" />
        </div>
      </div>
    </div>
  );
};

export default Home;
