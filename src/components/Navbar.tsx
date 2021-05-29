import { useState, useContext } from "react";
import styled from "styled-components";
import Link from "next/link";
import Icon from "./Icon";
import SettingsDropdown from "./SettingsDropdown";
import { ThemeContext, TestContext } from "../context";

const StyledNavbar = styled.div`
  display: flex;
  height: 4rem;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
`;

const Navbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { setLinkRestartTest } = useContext(TestContext);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // todo: restart test after clicking link

  return (
    <StyledNavbar>
      <Link prefetch href="/" passHref replace>
        <Logo
          onClick={() =>
            setLinkRestartTest((linkRestartTest) => linkRestartTest + 1)
          }
        >
          Typing
        </Logo>
      </Link>
      <SettingsDropdownContainer visible={settingsOpen}>
        <SettingsDropdown />
      </SettingsDropdownContainer>
      <Icon
        src="/icons/cog.svg"
        rotated={settingsOpen}
        onClick={() => setSettingsOpen((settingsOpen) => !settingsOpen)}
      />
      <Icon
        src="/icons/palette.svg"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <Icon src="/icons/user.svg" />
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
  z-index: 10;
`;

const SettingsDropdownContainer = styled.div<{ visible: boolean }>`
  flex: 1;
  display: flex;
  flex: row nowrap;
  justify-content: flex-end;
  position: relative;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;
