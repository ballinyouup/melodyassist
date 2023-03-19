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
        <AudioPlayer url="" title="Seed #225" />
        <AudioPlayer url="" title="Seed #5,684" />
        <AudioPlayer url="" title="Seed #10,986" />
      </main>
      <div className="flex justify-center">
        <div className="flex max-w-7xl items-start justify-center w-full flex-col mt-20">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
