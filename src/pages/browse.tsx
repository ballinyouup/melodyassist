import { api } from "~/utils/api";
import Layout from "./Layout";
import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const BrowseFeed = dynamic(() => import("./components/Home/BrowseFeed"), {
  ssr: false,
  loading: () => <>Loading...</>,
});

const Browse: React.FC = () => {
  const [faviconTheme, setFaviconTheme] = useState(false);

  const { data: userAudios, isLoading: feedLoading } =
    api.audio.getFeed.useQuery();
  const { data: users, isLoading: userCountLoading } =
    api.account.getUserCount.useQuery();

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
      <div className="flex w-full flex-col items-center justify-center">
        <div className="stats w-full grid-flow-row justify-center p-5 text-center shadow sm:w-fit sm:grid-flow-col">
          <div className="stat border-none">
            <div className="stat-title font-bold text-black text-opacity-80">
              Samples Uploaded
            </div>
            <div className="stat-value text-black">
              {!userCountLoading ? userAudios?.length : "0"}
            </div>
          </div>
          <div className="divider hidden h-4/5 sm:flex" />
          <div className="stat border-none">
            <div className="stat-title font-bold text-black">Total Users</div>
            <div className="stat-value text-black">
              {!userCountLoading ? users?.length : "0"}
            </div>
          </div>
        </div>
      </div>
      <BrowseFeed userAudios={userAudios} isLoading={feedLoading} />
    </div>
  );
};

export default Layout(Browse);
