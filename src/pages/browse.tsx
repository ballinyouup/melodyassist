import Layout from "./Layout";
import { useEffect, useState } from "react";
import Head from "next/head";
import BrowseFeed from "./components/Home/BrowseFeed";

const Browse: React.FC = () => {
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
    <div className="h-screen">
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
        <BrowseFeed />
      </main>
    </div>
  );
};

export default Layout(Browse);
