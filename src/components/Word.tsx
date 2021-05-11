import { memo } from "react";
import styled, { css } from "styled-components";

const StyledWord = styled.div<{ error: boolean }>`
  ${(props) =>
    props.error &&
    css`
      box-shadow: inset 0 -0.1em ${props.theme.colors.error};
    `};
  z-index: 2;
`;
interface IWord {
  currWordIdx: number;
  wordIdx: number;
  wordToType: string;
  wordTyped: string;
}

const Word = ({ currWordIdx, wordIdx, wordToType, wordTyped }: IWord) => {
  // Calculate props for StyledWord
  const wordError: boolean = wordIdx < currWordIdx && wordTyped !== wordToType;
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

export default memo(Word);

interface IStyledCharacter {
  visited: boolean;
  correct: boolean;
  extra: boolean;
}
const StyledCharacter = memo(styled.div<IStyledCharacter>`
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
