import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSession, getProviders, signIn } from "next-auth/client";
import { Provider } from "next-auth/providers";
import styled from "styled-components";
import Head from "../components/Head";
import AppContainer from "../components/AppContainer";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Footer from "../components/Footer";

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

  return (
    <>
      <Head />
      <AppContainer>
        <Navbar includeSettings={false} />
        {!loading && !session && (
          <SignInContainer>
            {providers !== null &&
              Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <Button
                    onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  >
                    Sign in with {provider.name}
                  </Button>
                </div>
              ))}
          </SignInContainer>
        )}
        <Footer>
          Privacy Notice: This site will not store any passwords or personal
          information besides name and email.
        </Footer>
      </AppContainer>
    </>
  );
};

export default SignIn;

const SignInContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
`;
