import React from "react";
import styled, { keyframes, css } from "styled-components";

const Caret = ({ position, blinking, smooth }) => {
  return (
    <StyledCaret
      left={position.left}
      top={position.top}
      blinking={blinking}
      smooth={smooth}
    />
  );
};

export default Caret;

const StyledCaret = styled.div`
  position: absolute;
  z-index: -1;

  // Caret shape
  width: 0.25rem;
  height: 2rem;
  border-radius: 2rem;
  background-color: blue;

  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;

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

const blink = keyframes`
  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
`;
