import { useContext } from "react";
import styled from "styled-components";
import TestContext from "../context";

interface IKeytip {
  visible: boolean;
}

const StyledKeyTip = styled.div<IKeytip>`
  display: flex;
  align-items: center;

  // make keytip disappear during typing test
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 250ms ease;
`;

const Keytip = () => {
  const { timerRunning } = useContext(TestContext);

  return (
    <StyledKeyTip visible={!timerRunning}>
      <KeytipBox>tab</KeytipBox>
      <KeytipText> - restart test</KeytipText>
    </StyledKeyTip>
  );
};

export default Keytip;

const KeytipBox = styled.div`
  color: ${(props) => props.theme.colors.background};
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 0.2em;
  padding: 0.2em 0.3em;
`;

const KeytipText = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  white-space: pre;
`;
