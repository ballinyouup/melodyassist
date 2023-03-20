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
        <AudioPlayer url="/Seed-42573_.mp3" title="42573" volume={volume} />
        <AudioPlayer url="/Seed-61365_.mp3" title="61365" volume={volume} />
        <AudioPlayer url="/Seed-36543_.mp3" title="36543" volume={volume} />
        <AudioPlayer url="/Seed-59440_.mp3" title="59440" volume={volume} />
        <AudioPlayer url="/Seed-46452_.mp3" title="46452" volume={volume} />
        <AudioPlayer url="/out.mp3" desc="Extras #1" volume={volume} />
        <AudioPlayer url="/out(1).mp3" desc="Extras #2" volume={volume} />
        <AudioPlayer url="/out(2).mp3" desc="Extras #3" volume={volume} />
        <AudioPlayer url="/out(3).mp3" desc="Extras #4" volume={volume} />
        <AudioPlayer url="/out(4).mp3" desc="Extras #5" volume={volume} />
        <AudioPlayer url="/out(5).mp3" desc="Extras #6" volume={volume} />
      </main>
      <div className="flex justify-center">
        <div className="mt-20 flex w-full max-w-7xl flex-col items-start justify-center">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
