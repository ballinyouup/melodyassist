/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import Layout from "./Layout";
import Hero from "./components/Home/Hero";
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Audio Share</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Hero />
      </main>
    </>
  );
};

export default Layout(Home);
