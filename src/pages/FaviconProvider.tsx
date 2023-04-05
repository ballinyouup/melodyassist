import Head from "next/head";
import { useState, useEffect } from "react";

interface Favicon {
  children: React.ReactNode;
}

const FaviconProvider: React.FC<Favicon> = ({ children }) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDark(true);
    } else {
      setDark(false);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Melody Assist</title>
        <meta name="description" content="Level up your Music with AI" />
        {dark ? (
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
