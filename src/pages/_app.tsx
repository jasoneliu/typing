import { useState } from "react";
import { AppProps } from "next/app";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import * as themes from "../themes";
import { ThemeContext } from "../context";
import "../fonts.css";

// Global style
const GlobalStyle = createGlobalStyle`
  html, body {
    background-color: ${(props) => props.theme.colors.background};
    font-family: "Myosevka", monospace;
    /* font-family: Consolas, Menlo, "Courier New", monospace; */
    height: 100%;
    margin: 0;
    padding: 0;

    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.colors.secondary} transparent;
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
  const [theme, setTheme] = useState<themes.themeType>("dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={themes[theme]}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
