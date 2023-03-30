/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import Hero from "./components/Home/Hero";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import Layout from "./Layout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Home: NextPage = () => {
  const [faviconTheme, setFaviconTheme] = useState(false);
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
      </main>
    </div>
  );
};

export default Layout(Home);
