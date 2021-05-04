import styled from "styled-components";

const StyledNavbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 2rem;
`;
const Navbar = () => {
  return (
    <StyledNavbar>
      <Logo>Typing</Logo>
      <StyledIcon
        src="/icons/github.svg"
        onClick={() =>
          window.open("https://github.com/jasoneliu/typing", "new_window")
        }
      />
      <StyledIcon src="/icons/cog.svg" />
      <StyledIcon src="/icons/palette.svg" />
      <StyledIcon src="/icons/user.svg" />
    </StyledNavbar>
  );
};

export default Navbar;

const Logo = styled.div`
  font-size: 4rem;
  color: ${(props) => props.theme.colors.accent};
  flex: 1;
`;

interface IStyledIcon {
  src: string;
}

const StyledIcon = styled.div<IStyledIcon>`
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
  transition-duration: 250ms;
`;
