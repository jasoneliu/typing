import { useEffect } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/client";
import styled from "styled-components";
import Head from "../components/Head";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import LoadingIcon from "../components/LoadingIcon";
import prisma from "../../lib/prisma";

// get user's typing test data
export const getStaticProps: GetStaticProps = async () => {
  const tests = await prisma.test.findMany({
    // where: { mode: "words" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
  return { props: { tests } };
};

interface ITest {
  id: number;
  user: {
    name: string;
    email: string;
  };
  punctuation: boolean;
  numbers: boolean;
  mode: string;
  length: string;
  wpm: number;
  accuracy: number;
}

// User page
const UserPage = ({ tests }: { tests: ITest[] }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  // redirect to signin page if not already signed in
  useEffect(() => {
    if (!loading && !session) {
      router.push("/signin");
    }
  }, [session, loading]);

  return (
    <>
      <Head />
      <AppContainer>
        <Navbar includeSettings={false} />
        <UserContainer>
          {loading && <LoadingIcon size={5} color={"accent"} />}
          {!loading &&
            session &&
            tests.map((test, testIdx) => (
              <div key={testIdx}>
                mode: {test.mode}, length:{test.length}, wpm:
                {test.wpm.toFixed(2)}, acc: {test.accuracy.toFixed(2)}
              </div>
            ))}
          <Button onClick={() => signOut()}>Sign Out</Button>
          {/* TODO: ROUTE AFTER SIGNOUT */}
        </UserContainer>
        <Footer />
      </AppContainer>
    </>
  );
};

export default UserPage;

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
`;

const UserContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
`;
