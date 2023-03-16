/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import Layout from "./Layout";
import Hero from "./components/Home/Hero";
import { api } from "~/utils/api";
import Search from "./components/Home/Search";
import AudioProfile from "./components/Home/AudioProfile";
const Home: NextPage = () => {
  const userData = api.account.getUserData.useQuery();
  // Add check to change icon based on system preference
  return (
    <div data-theme={userData.data?.theme ?? "winter"} className="h-[91vh]">
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
        <Search />
        <AudioProfile />
      </main>
    </div>
  );
};

export default Layout(Home);
