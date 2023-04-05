/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";

import Hero from "./components/Home/Hero";

import { Poppins } from "next/font/google";
import Layout from "./Layout";
import FAQ from "./components/Home/FAQ";
import Card from "./components/Home/Card";
import Divider from "./components/Home/Divider";
import { api } from "~/utils/api";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Home: NextPage = () => {
  const { data: userAudios } = api.audio.getFeed.useQuery();
  const { data: users, isLoading: userCountLoading } =
    api.account.getUserCount.useQuery();
  return (
    <div className={poppins.className}>
      <main>
        <Hero />
        <div className="flex w-full flex-col items-center justify-center pb-8">
          <div className="stats w-full grid-flow-row justify-center border border-gray-500 border-opacity-20 p-5 text-center sm:w-fit sm:grid-flow-col md:mt-2">
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
        <Card
          title={"Generate AI generated Audio"}
          image={"/home-image.png"}
          text={"Trained on hundreds of royalty free loops"}
        />
        <Divider />
        <Card
          title={"Generate AI generated Audio"}
          image={"/home-image.png"}
          reverse
          text={"Trained on hundreds of royalty free loops"}
        />
        <Divider />
        <Card
          title={"Generate AI generated Audio"}
          image={"/home-image.png"}
          text={"Trained on hundreds of royalty free loops"}
        />
        <Divider />
        <FAQ />
      </main>
    </div>
  );
};

export default Layout(Home);
