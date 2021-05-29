import styled, { css } from "styled-components";

interface IIcon {
  src: string;
  rotated?: boolean;
  onClick?: () => void;
}

const Icon = ({ src, onClick, rotated }: IIcon) => {
  return (
    <IconContainer onClick={onClick}>
      <StyledIcon src={src} rotated={rotated} />
    </IconContainer>
  );
};

export default Icon;

const StyledIcon = styled.div<{ src: string; rotated: boolean | undefined }>`
  height: 3rem;
  width: 3rem;
  mask: ${(props) => `url(${props.src})`} no-repeat 50% 50%;

  background-color: ${(props) => props.theme.colors.secondary};
  transition: background-color 250ms ease;

  // rotate icon
  ${(props) =>
    props.rotated !== undefined &&
    css`
      transform: ${props.rotated ? `rotate(0deg)` : `rotate(120deg)`};
      transition: background-color 250ms ease, transform 250ms linear;
    `}
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4.5rem;
  width: 4.5rem;
  z-index: 1;

  // change icon color on hover
  &:hover {
    ${StyledIcon} {
      background-color: ${(props) => props.theme.colors.primary};
    }
  }

  /* // change icon color while clicked
  &:active {
    ${StyledIcon} {
      background-color: ${(props) => props.theme.colors.secondary};
    }
  } */
`;
