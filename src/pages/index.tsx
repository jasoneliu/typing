import React from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import TypingTest from "../components/TypingTest";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import * as themes from "../themes";

// Global style
const GlobalStyle = createGlobalStyle`
  html, body {
    background-color: ${(props) => props.theme.colors.background};
    font-family: "Courier New", monospace;
    /* font-family: "Times New Roman", Georgia, serif; */
    /* font-family: Helvetica, Arial, sans-serif; */ 
    height: 100%;
    margin: 0;
    padding: 0;
  }
  * {
    box-sizing: border-box;
  }
  #__next {
    height: 100%;
    margin: 0;
    padding: 0;
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
      <AppContainer>
        <Navbar />
        <TypingTest />
        <div style={{ height: `4rem` }}></div>
      </AppContainer>
    </ThemeProvider>
  );
};

export default Home;

const AppContainer = styled.div`
  max-width: 65rem;
  height: 100%;
  margin: 0 auto;
  padding: 3rem;
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
  user-select: none;
`;
