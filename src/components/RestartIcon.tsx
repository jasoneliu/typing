import React, { useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { TestContext } from "../context";

const RestartIcon = () => {
  const [rotating, setRotating] = useState(false);
  const { setManualRestartTest } = useContext(TestContext);

  return (
    <>
      {rotating ? (
        <StyledRestartIconRotating src="/icons/restart.svg" />
      ) : (
        <StyledRestartIcon
          src="/icons/restart.svg"
          onClick={() => {
            // rotate
            setRotating(true);
            setManualRestartTest((manualRestartTest) => manualRestartTest + 1);
            setTimeout(() => setRotating(false), 500);
          }}
        />
      )}
    </>
  );
};

export default RestartIcon;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledRestartIcon = styled.div<{
  src: string;
}>`
  height: 2rem;
  width: 2rem;
  mask: ${(props) => `url(${props.src})`} no-repeat 50% 50%;
  margin: 0.5rem;
  z-index: 20;

  background-color: ${(props) => props.theme.colors.secondary};
  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
  }
`;

const StyledRestartIconRotating = styled(StyledRestartIcon)`
  // spin icon
  animation: ${rotate} 0.5s linear;
`;
