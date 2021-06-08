import styled from "styled-components";
import Head from "../components/Head";
import Navbar from "../components/Navbar";
import TypingTest from "../components/TypingTest";
import Keytip from "../components/Keytip";

// Home page: typing test app
const HomePage = () => {
  return (
    <>
      <Head />
      <AppContainer>
        <Navbar includeSettings={true} />
        <TypingTest />
        <Footer>
          <Keytip />
        </Footer>
      </AppContainer>
    </>
  );
};

export default HomePage;

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
