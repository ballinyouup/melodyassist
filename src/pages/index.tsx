/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";

import Hero from "./components/Home/Hero";

import { Poppins } from "next/font/google";
import Layout from "./Layout";
import FAQ from "./components/Home/FAQ";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Home: NextPage = () => {
  return (
    <div className={poppins.className}>
      <main>
        <Hero />
        <FAQ />
      </main>
    </div>
  );
};

export default Layout(Home);
