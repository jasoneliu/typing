import styled, { keyframes } from "styled-components";

interface ILoadingIcon {
  size?: number;
  color?: "secondary" | "accent";
}

const LoadingIcon = ({ size, color }: ILoadingIcon) => {
  return (
    <StyledLoadingIcon src="/icons/spinner.svg" size={size} color={color} />
  );
};

export default LoadingIcon;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledLoadingIcon = styled.div<{
  src: string;
  size: number | undefined;
  color: "secondary" | "accent" | undefined;
}>`
  height: ${(props) => (props.size === undefined ? 3 : props.size)}rem;
  width: ${(props) => (props.size === undefined ? 3 : props.size)}rem;
  mask: ${(props) => `url(${props.src})`} no-repeat 50% 50%;
  margin: 0.5rem;
  z-index: 20;

  background-color: ${(props) =>
    props.theme.colors[props.color === undefined ? "secondary" : props.color]};

  // spin icon
  animation: ${rotate} 2s infinite linear;
`;
