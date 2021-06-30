import { useState } from "react";
import { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import * as themes from "../themes";
import {
  ThemeContext,
  TestContext,
  SettingsContext,
  ModeType,
} from "../context";
import "../fonts.css";

// Global style
const GlobalStyle = createGlobalStyle`
  html, body {
    background-color: ${(props) => props.theme.colors.background};
    height: 100%;
    margin: 0;
    padding: 0;
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.colors.secondary} transparent;
  }

  html, body, button {
    font-family: "Myosevka", monospace;
  }

  * {
    box-sizing: border-box;
    transition: background-color 250ms ease, color 250ms ease;
  }

  #__next {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

const App = ({ Component, pageProps }: AppProps) => {
  // ThemeContext values
  const [theme, setTheme] = useState<themes.themeType>("dark");

  // TestContext values
  const [timerRunning, setTimerRunning] = useState(false);
  const [linkRestartTest, setLinkRestartTest] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // SettingsContext values
  const [settings, setSettings] = useState({
    text: { punctuation: false, numbers: false },
    mode: "words" as ModeType,
    length: {
      timed: "30",
      words: "50",
      quote: "medium",
      // lyrics: "medium",
      // books: "medium",
      // code: "medium",
    },
  });

  return (
    <Provider session={pageProps.session}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <ThemeProvider theme={themes[theme]}>
          <GlobalStyle />
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
              <Component {...pageProps} />
            </TestContext.Provider>
          </SettingsContext.Provider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </Provider>
  );
};

export default App;
