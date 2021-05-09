import { AppProps } from "next/app";
import { ThemeProvider, createGlobalStyle } from "styled-components";
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

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <ThemeProvider theme={themes.dark}>
        <GlobalStyle />
        <Component {...pageProps} />;
      </ThemeProvider>
    </>
  );
};

export default App;
