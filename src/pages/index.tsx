import useIsMobile from "../hooks/useIsMobile";
import Head from "../components/Head";
import AppContainer from "../components/AppContainer";
import Navbar from "../components/Navbar";
import TypingTest from "../components/TypingTest";
import Footer from "../components/Footer";
import RestartIcon from "../components/RestartIcon";
import Keytip from "../components/Keytip";

// Home page: typing test app
const HomePage = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Head />
      <AppContainer>
        <Navbar includeSettings={true} />
        <TypingTest />
        <Footer>
          {isMobile !== undefined && (isMobile ? <RestartIcon /> : <Keytip />)}
        </Footer>
      </AppContainer>
    </>
  );
};

export default HomePage;
