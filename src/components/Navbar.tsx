import { useContext } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useSession } from "next-auth/client";
import Icon, { UserIcon } from "./Icon";
import LoadingIcon from "./LoadingIcon";
import SettingsDropdown from "./SettingsDropdown";
import { ThemeContext, TestContext } from "../context";

const StyledNavbar = styled.div`
  display: flex;
  height: 4rem;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
`;

const Navbar = ({ includeSettings }: { includeSettings: boolean }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { setLinkRestartTest, settingsOpen, setSettingsOpen } =
    useContext(TestContext);
  const [session, loading] = useSession();

  return (
    <StyledNavbar>
      <Link href="/" passHref>
        <Logo
          onClick={() =>
            includeSettings &&
            setLinkRestartTest((linkRestartTest) => linkRestartTest + 1)
          }
        >
          Typing
        </Logo>
      </Link>

      <SettingsDropdownContainer>
        {includeSettings && <SettingsDropdown open={settingsOpen} />}
      </SettingsDropdownContainer>

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
            <UserIcon
              src="/icons/user.svg"
              username={(session?.user?.email as string).split("@")[0]}
              onClick={() => {
                setSettingsOpen(false);
                setLinkRestartTest(0);
              }}
            />
          </Link>
        ) : (
          <Link href={"/signin"} passHref>
            <Icon
              src="/icons/user.svg"
              onClick={() => {
                setSettingsOpen(false);
                setLinkRestartTest(0);
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
    </StyledNavbar>
  );
};

export default Navbar;

const Logo = styled.a`
  font-size: 4rem;
  color: ${(props) => props.theme.colors.accent};
  text-decoration: none;
  z-index: 3;
`;

const SettingsDropdownContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  position: relative;
  height: 100%;
`;
