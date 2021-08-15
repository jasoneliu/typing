import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSession, getSession, signOut } from "next-auth/client";
import { Test } from "@prisma/client";
import styled from "styled-components";
import Head from "../components/Head";
import AppContainer from "../components/AppContainer";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import LoadingIcon from "../components/LoadingIcon";
import Footer from "../components/Footer";
import prisma from "../../lib/prisma";

// get user's typing test data
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  let tests: Test[] = [];
  if (session !== null) {
    // query tests with matching user id
    tests = await prisma.test.findMany({
      where: {
        userId: { equals: session.user.id },
      },
    });
  }
  return { props: { tests } };
};

// User page
const UserPage = ({ tests }: { tests: Test[] }) => {
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
          {!loading && session && (
            <>
              <Table>
                <thead>
                  <tr>
                    <td>mode</td>
                    <td>length</td>
                    <td>wpm</td>
                    <td>accuracy</td>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, testIdx) => (
                    <tr key={testIdx}>
                      <td>{test.mode}</td>
                      <td>{test.length}</td>
                      <td>{test.wpm.toFixed(2)}</td>
                      <td>{test.accuracy.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </UserContainer>
        <Footer>
          <Button
            onClick={async () => {
              const data = await signOut({
                redirect: false,
                callbackUrl: "/",
              });
              router.push(data.url);
            }}
          >
            Sign Out
          </Button>
        </Footer>
      </AppContainer>
    </>
  );
};

export default UserPage;

const UserContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
`;

const Table = styled.table`
  color: ${(props) => props.theme.colors.primary};
  border-collapse: collapse;

  &&& {
    thead {
      font-size: 0.8rem;
      color: ${(props) => props.theme.colors.secondary};
    }
    tbody {
      tr {
        :nth-child(odd) {
          background-color: ${(props) => props.theme.colors.secondary};
        }
      }
    }
    td {
      padding: 0.25rem 1rem 0.25rem 0.5rem;
    }
  }
`;
