import { useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import { useSession } from "next-auth/client";
import Icon from "./Icon";
import LoadingIcon from "./LoadingIcon";
import SettingsDropdown from "./SettingsDropdown";
import { ThemeContext, TestContext } from "../context";

const StyledNavbar = styled.div`
  display: flex;
  height: 4rem;
  flex-flow: row wrap;
  align-items: flex-start;
`;

const Navbar = ({ includeSettings }: { includeSettings: boolean }) => {
  const [mobileLayout, setMobileLayout] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const { setManualRestartTest, settingsOpen, setSettingsOpen } =
    useContext(TestContext);
  const [session, loading] = useSession();

  // Change navbar layout when viewpoint changes
  const handleViewportChange = (
    event: MediaQueryList | MediaQueryListEvent
  ) => {
    setMobileLayout(event.matches);
  };

  // Set initial navbar layout
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 45rem)");
    mediaQuery.addEventListener("change", handleViewportChange);
    handleViewportChange(mediaQuery);
  }, []);

  return (
    <StyledNavbar>
      <Link href="/" passHref>
        <Logo
          onClick={() =>
            includeSettings &&
            setManualRestartTest((manualRestartTest) => manualRestartTest + 1)
          }
        >
          Typing
        </Logo>
      </Link>

      <SettingsDropdownContainer mobileLayout={mobileLayout}>
        {includeSettings && (
          <SettingsDropdown open={settingsOpen} mobileLayout={mobileLayout} />
        )}
      </SettingsDropdownContainer>

      <IconContainer
        includeSettings={includeSettings}
        mobileLayout={mobileLayout}
      >
        {includeSettings && (
          <Icon
            src="/icons/cog.svg"
            rotated={settingsOpen}
            onClick={() => setSettingsOpen((settingsOpen) => !settingsOpen)}
          />
        )}

        <Icon
          src="/icons/palette.svg"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />

        {loading && <LoadingIcon />}
        {!loading &&
          (session ? (
            <Link href={"/user"} passHref>
              <Icon
                src="/icons/user.svg"
                userIcon={true}
                username={session.user.email.split("@")[0]}
                onClick={() => {
                  setSettingsOpen(false);
                  setManualRestartTest(0);
                }}
              />
            </Link>
          ) : (
            <Link href={"/signin"} passHref>
              <Icon
                src="/icons/user.svg"
                onClick={() => {
                  setSettingsOpen(false);
                  setManualRestartTest(0);
                }}
              />
            </Link>
          ))}

        <Icon
          src="/icons/github.svg"
          onClick={() =>
            window.open("https://github.com/jasoneliu/typing", "new_window")
          }
        />
      </IconContainer>

      <div style={{ flexBasis: "100%", height: 0 }} />
    </StyledNavbar>
  );
};

export default Navbar;

const Logo = styled.a`
  position: fixed;
  align-self: center;
  font-size: 4rem;
  color: ${(props) => props.theme.colors.accent};
  text-decoration: none;
  z-index: 3;
`;

const SettingsDropdownContainer = styled.div<{ mobileLayout: boolean }>`
  flex: 1;
  display: flex;
  align-self: flex-start;
  justify-content: flex-end;
  position: relative;
  z-index: 15;

  ${(props) =>
    props.mobileLayout &&
    css`
      top: 4.5rem;
      justify-content: flex-start;
      transform: scale(0.9);
      transform-origin: top left;
      margin: -1rem 0 0 0.75rem;
      order: 1;
    `}
`;

const IconContainer = styled.div<{
  includeSettings: boolean;
  mobileLayout: boolean;
}>`
  display: flex;
  position: relative;
  z-index: 20;

  ${(props) =>
    props.mobileLayout &&
    css`
      top: 4.5rem;
      transform: scale(0.6);
      transform-origin: top left;
    `}
`;
