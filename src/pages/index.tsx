import React, { useState } from "react";
import styled from "styled-components";
import Head from "../components/Head";
import Navbar from "../components/Navbar";
import TypingTest from "../components/TypingTest";
import Keytip from "../components/Keytip";
import { TestContext } from "../context";

// Home page: typing test app
const Home = () => {
  const [timerRunning, setTimerRunning] = useState(true);

  return (
    <TestContext.Provider value={{ timerRunning, setTimerRunning }}>
      <Head />
      <AppContainer>
        <Navbar />
        <TypingTest />
        <Footer>
          <Keytip />
        </Footer>
      </AppContainer>
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
