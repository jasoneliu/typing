import React from "react";
import styled from "styled-components";

const Character = ({ id, char, visited, correct, extra }) => {
  return (
    <StyledCharacter id={id} visited={visited} correct={correct} extra={extra}>
      {char}
    </StyledCharacter>
  );
};

export default React.memo(Character);

const StyledCharacter = styled.div`
  color: ${(props) =>
    props.visited
      ? props.correct
        ? "black"
        : props.extra
        ? "darkred"
        : "red"
      : "gray"};
  display: inline;
  font-size: 2rem;
`;
