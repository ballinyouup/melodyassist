/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import Hero from "./components/Home/Hero";
//import AudioPlayer from "./components/Home/AudioPlayer";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Home: NextPage = () => {
  const [volume, setVolume] = useState<number>(80);
  const [faviconTheme, setFaviconTheme] = useState(false);
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setFaviconTheme(true);
    } else {
      setFaviconTheme(false);
    }
  }, []);

  return (
    <div className={poppins.className}>
      <Head>
        <title>Melody Assist</title>
        <meta name="description" content="Level up your Music with AI" />
        {faviconTheme ? (
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
              <div className="stat-title font-bold text-opacity-80 text-black">
                Drum Loops Generated
              </div>
              <div className="stat-value text-black">9,999</div>
            </div>
            <div className="divider hidden h-4/5 sm:flex" />
            <div className="stat border-none">
              <div className="stat-title font-bold text-black">Total Users</div>
              <div className="stat-value text-black">9,999</div>
            </div>
          </div>
        </div>
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
