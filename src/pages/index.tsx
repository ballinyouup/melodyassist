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
        <AudioPlayer url="Seed-9451_,.mp3" title="9451" />
        <AudioPlayer url="Seed-23426_,.mp3" title="23426" />
        <AudioPlayer url="Seed-51938_,.mp3" title="51938" />
        <AudioPlayer url="Seed-56485_,.mp3" title="56485" />
        <AudioPlayer url="out.mp3" desc="Extras #1" />
        <AudioPlayer url="out (1).mp3" desc="Extras #1" />
        <AudioPlayer url="out (2).mp3" desc="Extras #2" />
        <AudioPlayer url="out (3).mp3" desc="Extras #3" />
        <AudioPlayer url="out (4).mp3" desc="Extras #4" />
        <AudioPlayer url="out (5).mp3" desc="Extras #5" />
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
