/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import Hero from "./components/Home/Hero";
import { api } from "~/utils/api";
import AudioPlayer from "./components/Home/AudioPlayer";
import Footer from "./components/Footer";

const Home: NextPage = () => {
  const userData = api.account.getUserData.useQuery();
  // Add check to change icon based on system preference
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
        <Hero />
        <AudioPlayer url="/Seed-42573_.mp3" title="42573" />
        <AudioPlayer url="/Seed-61365_.mp3" title="61365" />
        <AudioPlayer url="/Seed-36453_.mp3" title="36543" />
        <AudioPlayer url="/Seed-59440.mp3" title="59440" />
        <AudioPlayer url="/out.mp3" desc="Extras #1" />
        <AudioPlayer url="/out(1).mp3" desc="Extras #1" />
        <AudioPlayer url="/out(2).mp3" desc="Extras #2" />
        <AudioPlayer url="/out(3).mp3" desc="Extras #3" />
        <AudioPlayer url="/out(4).mp3" desc="Extras #4" />
        <AudioPlayer url="/out(5).mp3" desc="Extras #5" />
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
