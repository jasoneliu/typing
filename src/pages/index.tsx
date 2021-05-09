import React, { useState } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import AppHead from "../components/AppHead";
import Navbar from "../components/Navbar";
import TypingTest from "../components/TypingTest";
import Hint from "../components/Hint";
import TestContext from "../context";
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
  const [timerRunning, setTimerRunning] = useState(true);

  return (
    <TestContext.Provider value={{ timerRunning, setTimerRunning }}>
      <ThemeProvider theme={themes.dark}>
        <GlobalStyle />
        <AppHead />
        <AppContainer>
          <Navbar />
          <TypingTest />
          <Footer>
            {/* <Hint visible={!timerRunning} /> */}
            <Hint />
          </Footer>
        </AppContainer>
      </ThemeProvider>
    </TestContext.Provider>
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

const Footer = styled.div`
  height: 4rem;
  font-size: 1rem;
  margin: 0 auto;
`;
