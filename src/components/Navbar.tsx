import { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../context";

const StyledNavbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 2rem;
`;
const Navbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <StyledNavbar>
      <Logo>Typing</Logo>
      <Icon
        src="/icons/github.svg"
        onClick={() =>
          window.open("https://github.com/jasoneliu/typing", "new_window")
        }
      />
      <Icon src="/icons/cog.svg" />
      <Icon
        src="/icons/palette.svg"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <Icon src="/icons/user.svg" />
    </StyledNavbar>
  );
};

export default Navbar;

const Logo = styled.div`
  font-size: 4rem;
  color: ${(props) => props.theme.colors.accent};
  flex: 1;
`;

// TODO: give icon more padding for easier click
const Icon = styled.div<{ src: string }>`
  mask: ${(props) => `url(${props.src})`} no-repeat 50% 50%;
  height: 3rem;
  width: 3rem;
  /* width: 100%; */
  z-index: 1;

  // change color on hover
  background-color: ${(props) => props.theme.colors.secondary};
  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
  }
  transition: background-color 250ms ease;
`;
