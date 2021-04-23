import React from "react";
import styled, { css } from "styled-components";

interface IWord {
  currWordIdx: number;
  wordIdx: number;
  wordToType: string;
  wordTyped: string;
}
interface IStyledWord {
  error: boolean;
}
const StyledWord = styled.div<IStyledWord>`
  display: inline-block;
  font-size: 2rem;
  ${(props) =>
    props.error &&
    css`
      box-shadow: inset 0 -0.15rem ${props.theme.colors.error};
    `};
  margin: 0.15rem 0.5rem;
  user-select: none;
`;

const Word = ({ currWordIdx, wordIdx, wordToType, wordTyped }: IWord) => {
  // Calculate props for StyledWord
  const wordError: boolean =
    wordIdx < currWordIdx && wordTyped.length !== wordToType.length;
  const charsToType: string[] = wordToType.split("");
  let extraCharsTyped: string[] = [];
  if (wordIdx <= currWordIdx && wordToType.length < wordTyped.length) {
    extraCharsTyped = wordTyped
      .slice(wordToType.length - wordTyped.length)
      .split("");
  }

  return (
    <StyledWord error={wordError}>
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

interface IStyledCharacter {
  visited: boolean;
  correct: boolean;
  extra: boolean;
}
const StyledCharacter = React.memo(styled.div<IStyledCharacter>`
  color: ${(props) =>
    props.visited
      ? props.correct
        ? props.theme.colors.primary
        : props.extra
        ? props.theme.colors.errorExtra
        : props.theme.colors.error
      : props.theme.colors.secondary};
  display: inline-block;
`);
