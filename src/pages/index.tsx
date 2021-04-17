import React from "react";
import Head from "next/head";
import TypingTest from "../components/TypingTest";

// Home page: typing test app
const Home = () => {
  return (
    <div>
      <Head>
        <title>Typing Test</title>
        <meta charSet="utf-8" />
        <meta name="name" content="" />
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta name="author" content="Jason Liu" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <TypingTest />
    </div>
  );
};

export default Home;
