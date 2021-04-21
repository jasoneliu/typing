import React from "react";
import styled, { css } from "styled-components";

interface WordProps {
  currWordIdx: number;
  wordIdx: number;
  wordToType: string;
  wordTyped: string;
}
interface StyledWordProps {
  incorrect: boolean;
}
const StyledWord = styled.div<StyledWordProps>`
  display: inline-block;
  font-size: 2rem;
  ${(props) =>
    props.incorrect &&
    css`
      box-shadow: inset 0 -0.15rem red;
    `};
  margin: 0.15rem 0.5rem;
  font-family: "Courier New", monospace;
  /* font-family: "Times New Roman", Georgia, serif; */
  /* font-family: Helvetica, Arial, sans-serif; */
  user-select: none;
`;

const Word = ({ currWordIdx, wordIdx, wordToType, wordTyped }: WordProps) => {
  const wordIncorrect =
    wordIdx < currWordIdx && wordTyped.length !== wordToType.length;
  const charsToType = wordToType.split("");
  let extraCharsTyped: string[] = [];
  if (wordIdx <= currWordIdx && wordToType.length < wordTyped.length) {
    extraCharsTyped = wordTyped
      .slice(wordToType.length - wordTyped.length)
      .split("");
  }

  return (
    <StyledWord incorrect={wordIncorrect}>
      {/* Characters of the current wordToType */}
      {charsToType.map((char, charIdx) => {
        const charVisited =
          wordIdx <= currWordIdx && charIdx < wordTyped.length;
        const charCorrect = charVisited && char === wordTyped[charIdx];
        return (
          <StyledCharacter
            key={`${wordIdx}-${charIdx}`}
            id={`${wordIdx}-${charIdx}`}
            visited={charVisited}
            correct={charCorrect}
            extra={false}
          >
            {char}
          </StyledCharacter>
        );
      })}
      {/*Extra characters extending past the current wordToType*/}
      {extraCharsTyped.length > 0 &&
        extraCharsTyped.map((char, charIdx) => {
          return (
            <StyledCharacter
              key={`${wordIdx}-${wordToType.length + charIdx}`}
              id={`${wordIdx}-${wordToType.length + charIdx}`}
              visited={true}
              correct={false}
              extra={true}
            >
              {char}
            </StyledCharacter>
          );
        })}
    </StyledWord>
  );
};

export default React.memo(Word);

interface StyledCharacterProps {
  visited: boolean;
  correct: boolean;
  extra: boolean;
}
const StyledCharacter = React.memo(styled.div<StyledCharacterProps>`
  color: ${(props) =>
    props.visited
      ? props.correct
        ? "black"
        : props.extra
        ? "firebrick"
        : "red"
      : "gray"};
  display: inline-block;
`);
