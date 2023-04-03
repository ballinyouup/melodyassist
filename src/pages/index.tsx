/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import Hero from "./components/Home/Hero";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import Layout from "./Layout";
import Question from "./components/Home/Question";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Home: NextPage = () => {
  const [faviconTheme, setFaviconTheme] = useState(false);
  const questionsAndAnswers = [
    {
      question: "Are the samples royalty free?",
      answer: "Yes. You never have to worry about using them in your project.",
    },
    {
      question: "Are the samples royalty free?",
      answer: "Yes. You never have to worry about using them in your project.",
    },
    {
      question: "Are the samples royalty free?",
      answer: "Yes. You never have to worry about using them in your project.",
    },
    {
      question: "Are the samples royalty free?",
      answer: "Yes. You never have to worry about using them in your project.",
    },
  ];

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
        <div className="flex flex-col lg:flex-row">
          {questionsAndAnswers.map((item, index) => (
            <div key={index}>
              <Question question={item.question} answer={item.answer} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Layout(Home);
