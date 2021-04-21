import styled, { keyframes, css } from "styled-components";

interface CaretPositionProps {
  left: number;
  top: number;
}
interface StyledCaretProps {
  position: CaretPositionProps;
  blinking: boolean;
  smooth: boolean;
}

const StyledCaret = styled.div<StyledCaretProps>`
  position: absolute;
  z-index: -1;

  // Caret shape
  width: 0.25rem;
  height: 2rem;
  border-radius: 2rem;
  background-color: blue;

  left: ${(props) => props.position.left}px;
  top: ${(props) => props.position.top}px;

  // Smooth caret animation during typing
  ${(props) =>
    props.smooth &&
    css`
      transition-property: left, top;
      transition-duration: 100ms;
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