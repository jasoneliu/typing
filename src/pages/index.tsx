import React from "react";
import Head from "next/head";
import TypingTest from "../components/TypingTest";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import * as themes from "../themes";
import produce from "immer";

// Global style
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.primary};
    font-family: "Courier New", monospace;
    /* font-family: "Times New Roman", Georgia, serif; */
    /* font-family: Helvetica, Arial, sans-serif; */ 
  }
`;

// Home page: typing test app
const Home = () => {
  return (
    <ThemeProvider theme={themes.dark}>
      <GlobalStyle />
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
    </ThemeProvider>
  );
};

export default Home;
