/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import Hero from "./components/Home/Hero";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import Layout from "./Layout";
import dynamic from "next/dynamic";
import { api } from "~/utils/api";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const HomeFeed = dynamic(() => import("./components/Home/HomeFeed"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [volume, setVolume] = useState<number>(80);
  const [faviconTheme, setFaviconTheme] = useState(false);
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };
  const { data: userAudios } = api.audio.getFeed.useQuery();
  const { data: users } = api.account.getUserCount.useQuery();
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
        <Hero />
        <div className="flex w-full flex-col items-center justify-center">
          <div className="stats w-full grid-flow-row justify-center p-5 text-center shadow sm:w-fit sm:grid-flow-col">
            <div className="stat border-none">
              <div className="stat-title font-bold text-black text-opacity-80">
                Drum Loops Generated
              </div>
              <div className="stat-value text-black">{userAudios?.length}</div>
            </div>
            <div className="divider hidden h-4/5 sm:flex" />
            <div className="stat border-none">
              <div className="stat-title font-bold text-black">Total Users</div>
              <div className="stat-value text-black">{users?.length}</div>
            </div>
          </div>
        </div>
        <div className="flex h-20 w-full flex-row items-center justify-center gap-4">
          <button onClick={() => setVolume(volume === 0 ? 70 : 0)}>
            {volume === 0 ? (
              <img
                src="volume-mute.png"
                alt="volume muted"
                className="w-7 invert"
              />
            ) : (
              <img src="audio.png" alt="audio button" className="w-8 invert" />
            )}
          </button>
          <div
            className="tooltip tooltip-bottom tooltip-primary w-4/5 max-w-md sm:w-full"
            data-tip={volume}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              className="range range-xs w-full"
              onChange={handleVolumeChange}
            />
          </div>
        </div>
        <HomeFeed volume={volume} userAudios={userAudios} />
      </main>
    </div>
  );
};

export default Layout(Home);
