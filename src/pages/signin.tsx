import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSession, getProviders, signIn } from "next-auth/client";
import { Provider } from "next-auth/providers";
import styled from "styled-components";
import Head from "../components/Head";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

// Sign in page
const SignIn = ({ providers }: { providers: Provider[] }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  // redirect to user page if alreadly signed in
  useEffect(() => {
    if (!loading && session) {
      router.push("/user");
    }
  }, [session, loading]);

  // TODO: ROUTE AFTER SIGNIN

  return (
    <>
      <Head />
      <AppContainer>
        <Navbar includeSettings={false} />
        {!loading && !session && (
          <SignInContainer>
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <Button onClick={() => signIn(provider.id)}>
                  Sign in with {provider.name}
                </Button>
              </div>
            ))}
          </SignInContainer>
        )}
        <Footer />
      </AppContainer>
    </>
  );
};

export default SignIn;

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

const SignInContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
`;
