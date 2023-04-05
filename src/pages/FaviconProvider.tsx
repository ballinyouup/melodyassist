import Head from "next/head";
import { useState, useEffect } from "react";

interface Favicon {
  children: React.ReactNode;
}

const FaviconProvider: React.FC<Favicon> = ({ children }) => {
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
    <>
      <Head>
        <title>Melody Assist</title>
        <meta name="description" content="Level up your Music with AI" />
        {faviconTheme ? (
          <link rel="icon" href="/logo-dark.png" />
        ) : (
          <link rel="icon" href="/logo-light.png" />
        )}
      </Head>
      {children}
    </>
  );
};

export default FaviconProvider;
