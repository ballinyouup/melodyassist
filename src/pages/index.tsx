/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import Layout from "./Layout";
import Hero from "./components/Home/Hero";
import { api } from "~/utils/api";
const Home: NextPage = () => {
  const userData = api.account.getUserData.useQuery();
  // Add check to change icon based on system preference
  return (
    <div data-theme={userData.data?.theme ?? "winter"} className="h-[93vh]">
      <Head>
        <title>Audio Share</title>
        <meta name="description" content="Level up your Music with AI" />
        <link rel="icon" href="/logo-dark.png" />
      </Head>
      <main>
        <Hero />
      </main>
    </div>
  );
};

export default Layout(Home);
