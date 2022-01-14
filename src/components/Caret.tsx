import styled, { keyframes, css } from "styled-components";

interface ICaretPosition {
  left: number;
  top: number;
  bottom: number;
}
interface IStyledCaret {
  position: ICaretPosition;
  blinking: boolean;
  smooth: boolean;
}

const StyledCaret = styled.div.attrs<IStyledCaret>((props) => ({
  style: {
    left: `${props.position.left}px`,
    top: `calc((${props.position.top}px + ${props.position.bottom}px - 2.5ex) / 2)`,
  },
}))<IStyledCaret>`
  position: absolute;
  z-index: 5;

  // Caret shape
  width: 0.12em;
  height: 2.5ex;
  border-radius: 5ex;
  background-color: ${(props) => props.theme.colors.accent};

  // Smooth caret animation during typing
  ${(props) =>
    props.smooth &&
    css`
      transition: left 100ms ease, top 100ms ease, background-color 250ms ease;
    `}

  // Blinking caret animation before typing test starts
  ${(props) =>
    props.blinking &&
    css`
      animation: ${blink} 1s ease infinite;
    `}
`;
export default StyledCaret;

const blink = keyframes`
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
`;
