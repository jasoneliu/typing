import { useState } from "react";
import { AppProps } from "next/app";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import * as themes from "../themes";
import { ThemeContext } from "../context";

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
    transition: background-color 250ms ease, color 250ms ease;
  }

  #__next {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  /* .animate * {
    transition: color 250ms ease;
  } */
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
