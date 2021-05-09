import { useContext, useEffect } from "react";
import styled from "styled-components";
import TestContext from "../context";

interface IHint {
  visible: boolean;
}

const StyledHint = styled.div<IHint>`
  display: flex;
  align-items: center;

  // make hint disappear during typing test
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 250ms ease;
`;

const Hint = () => {
  const { timerRunning } = useContext(TestContext);

  return (
    <StyledHint visible={!timerRunning}>
      <HintBox>tab</HintBox>
      <HintText> - restart test</HintText>
    </StyledHint>
  );
};

export default Hint;

const HintBox = styled.div`
  color: ${(props) => props.theme.colors.background};
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 0.2em;
  padding: 0.2em 0.3em;
`;

const HintText = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  white-space: pre;
`;
