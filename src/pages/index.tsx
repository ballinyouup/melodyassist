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
          title={"Upload Audio Files"}
          image={"/home-image.png"}
          text={
            "With the audio file upload feature, you have the ability to express your creativity and share your unique sounds with the community. By sharing your samples, you can receive valuable feedback from other members of the community and build relationships with other music creators."
          }
        />
        <Divider />
        <Card
          title={"AI Drum Loop Generator"}
          image={"/home-image2.jfif"}
          reverse
          text={
            "The AI drum loop generation feature not only provides pre-generated drum loops, but also serves as a source of creative inspiration. You can use the pre-generated drum loops as a starting point for your own unique drum tracks and productions."
          }
        />
        <Divider mobileHide />
        <FAQ />
      </main>
    </div>
  );
};

export default Layout(Home);
