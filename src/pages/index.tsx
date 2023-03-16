/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import Layout from "./Layout";
import Hero from "./components/Home/Hero";
import { api } from "~/utils/api";
import Search from "./components/Home/Search";
import AudioPlayer from "./components/Home/AudioPlayer";
const Home: NextPage = () => {
  const userData = api.account.getUserData.useQuery();
  // Add check to change icon based on system preference
  return (
    <div data-theme={userData.data?.theme ?? "winter"} className="h-full">
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
        <AudioPlayer url="http://cld3097web.audiovideoweb.com/va90web25003/companions/Foundations%20of%20Rock/5.02.mp3" />
        <AudioPlayer url="http://cld3097web.audiovideoweb.com/va90web25003/companions/Foundations%20of%20Rock/5.03.mp3" />
        <AudioPlayer url="http://cld3097web.audiovideoweb.com/va90web25003/companions/Foundations%20of%20Rock/5.05.mp3" />
        <AudioPlayer url="http://cld3097web.audiovideoweb.com/va90web25003/companions/Foundations%20of%20Rock/6.01.mp3" />
      </main>
    </div>
  );
};

export default Layout(Home);
