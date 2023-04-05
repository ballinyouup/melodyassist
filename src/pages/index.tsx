/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Hero from "./components/Home/Hero";
import { Poppins } from "next/font/google";
import Layout from "./Layout";
import FAQ from "./components/Home/FAQ";
import Card from "./components/Home/Card";
import Divider from "./components/Home/Divider";
import dynamic from "next/dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Stats = dynamic(() => import("./components/Home/Stats"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className={poppins.className}>
      <main>
        <Hero />
        <Stats />
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
