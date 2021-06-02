import React, { useState } from "react";
import styled from "styled-components";
import Head from "../components/Head";
import Navbar from "../components/Navbar";
import TypingTest from "../components/TypingTest";
import Keytip from "../components/Keytip";
import { TestContext, SettingsContext } from "../context";

// Home page: typing test app
const Home = () => {
  // TestContext values
  const [timerRunning, setTimerRunning] = useState(false);
  const [linkRestartTest, setLinkRestartTest] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // SettingsContext values
  const [settings, setSettings] = useState({
    text: { capitals: false, symbols: false, numbers: false },
    mode: "words",
    length: {
      timed: "30",
      words: "50",
      quotes: "medium",
      lyrics: "medium",
      books: "medium",
      code: "medium",
    },
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <TestContext.Provider
        value={{
          timerRunning,
          setTimerRunning,
          linkRestartTest,
          setLinkRestartTest,
          settingsOpen,
          setSettingsOpen,
        }}
      >
        <Head />
        <AppContainer>
          <Navbar />
          <TypingTest />
          <Footer>
            <Keytip />
          </Footer>
        </AppContainer>
      </TestContext.Provider>
    </SettingsContext.Provider>
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
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  height: 4rem;
  font-size: 1rem;
`;
