import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";
import Character from "./Character";
import Caret from "./Caret";
import useKeyPress from "../hooks/useKeyPress";
import styled from "styled-components";
import produce from "immer";

interface ICaretPosition {
  left: number;
  top: number;
}

const TypingTest: React.FC = () => {
  // States of typing text
  const [wordsToType, setWordsToType] = useState<string[]>([""]);
  const [wordsTyped, setWordsTyped] = useState<string[]>([""]);
  const [currWordIdx, setCurrWordIdx] = useState(0);

  // Fetch random typing text
  const server =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3000"
      : "https://www.jasoneliu.com";
  const fetchWordsToType = () => {
    fetch(`${server}/text/words.json`)
      .then((response) => response.json())
      .then((data) => {
        const numWords = 50;
        let text = "";
        const wordList: string[] = data.oxford3000;
        const wordListLen = wordList.length;
        for (let wordIdx = 0; wordIdx < numWords; wordIdx++) {
          const randIdx = Math.floor(Math.random() * wordListLen);
          text += wordList[randIdx] + " ";
        }
        setWordsToType(text.trim().split(" "));
      });
  };
  useEffect(fetchWordsToType, []);

  // Refs to access updated state in useKeyPress
  const wordsToTypeRef = useRef<string[]>();
  wordsToTypeRef.current = wordsToType;
  const wordsTypedRef = useRef<string[]>();
  wordsTypedRef.current = wordsTyped;
  const currWordIdxRef = useRef<number>();
  currWordIdxRef.current = currWordIdx;

  // Caret
  const [caretPosition, setCaretPosition] = useState<ICaretPosition>(null);
  // Initialize caret position at start of text
  useEffect(() => {
    try {
      const rect = document.getElementById("0-0").getBoundingClientRect();
      const position: ICaretPosition = {
        left: rect.left,
        top: rect.top,
      };
      setCaretPosition(position);
    } catch {}
  }, [wordsToType]);

  // Timer
  const [seconds, setSeconds] = useState(0);
  const timerRunning = useRef(false);
  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning.current) {
        setSeconds((seconds) => seconds + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // TODO: "ctrl-backspace" to delete word, "enter" as single key
  // Process key presses
  useKeyPress((key: string) => {
    // Spacebar: go to next word
    if (key === " ") {
      if (!timerRunning.current) {
        return;
      }
      if (currWordIdxRef.current === wordsToTypeRef.current.length - 1) {
        timerRunning.current = false;
      } else {
        unstable_batchedUpdates(() => {
          setWordsTyped((currWordsTyped) => {
            return currWordsTyped.concat("");
          });
          setCurrWordIdx((currWordIdx) => currWordIdx + 1);
        });
      }
    }
    // Backspace: see below
    else if (key === "Backspace") {
      // If current word not empty, backspace (delete last character)
      if (!timerRunning.current) {
        return;
      }
      if (wordsTypedRef.current[currWordIdxRef.current].length > 0) {
        setWordsTyped((currWordsTyped) => {
          return produce(currWordsTyped, (nextWordsTyped) => {
            const currWord = currWordsTyped[currWordIdxRef.current];
            const newCurrWord = currWord.slice(0, currWord.length - 1);
            nextWordsTyped[currWordIdxRef.current] = newCurrWord;
          });
        });
      }
      // If current word empty, go to previous word
      else if (wordsTypedRef.current.length > 1) {
        unstable_batchedUpdates(() => {
          setWordsTyped((currWordsTyped) =>
            currWordsTyped.slice(0, currWordIdxRef.current)
          );
          setCurrWordIdx((currWordIdx) => currWordIdx - 1);
        });
      }
    }
    // Tab: restart test
    else if (key === "Tab") {
      timerRunning.current = false;
      unstable_batchedUpdates(() => {
        setWordsTyped([""]);
        setCurrWordIdx(0);
        setSeconds(0);
        fetchWordsToType();
      });
    }
    // Regular keys: add character to end of current word
    else if (
      timerRunning.current ||
      (wordsTypedRef.current[0] === "" && currWordIdxRef.current === 0)
    ) {
      timerRunning.current = true;
      setWordsTyped((currWordsTyped) => {
        return produce(currWordsTyped, (nextWordsTyped) => {
          const currWord = currWordsTyped[currWordIdxRef.current];
          const newCurrWord = currWord + key;
          nextWordsTyped[currWordIdxRef.current] = newCurrWord;
        });
      });
      // End the test if last word is correct
      if (
        currWordIdxRef.current === wordsToTypeRef.current.length - 1 &&
        wordsTypedRef.current[currWordIdxRef.current] ===
          wordsToTypeRef.current[currWordIdxRef.current]
      ) {
        setCurrWordIdx((currWordIdx) => currWordIdx + 1);
        timerRunning.current = false;
      }
    }
    // Update caret position
    setCaretPosition(() => {
      let caretWordIdx = currWordIdxRef.current;
      if (currWordIdxRef.current >= wordsToTypeRef.current.length) {
        caretWordIdx = wordsToTypeRef.current.length - 1;
      }
      const caretCharIdx = wordsTypedRef.current[caretWordIdx].length - 1;
      let beginningOfWord = false;
      if (caretCharIdx < 0) {
        beginningOfWord = true;
      }
      const id = caretWordIdx + "-" + Math.max(0, caretCharIdx);
      const rect = document.getElementById(id).getBoundingClientRect();
      const position = {
        left: beginningOfWord ? rect.left : rect.right,
        top: rect.top,
      };
      return position;
    });
  });

  return (
    <div>
      <div>Timer: {seconds}</div>
      <div>
        Words typed: {currWordIdx}/{wordsToType.length}
      </div>
      {/* <div>WPM: {}</div> */}
      {caretPosition !== null && (
        <Caret
          position={caretPosition}
          blinking={!timerRunning.current}
          smooth={true}
        />
      )}
      {/* Flex box for words to wrap */}
      <FlexContainer>
        {wordsToType.map((word, wordIdx) => {
          const charsToType = word.split("");
          let extraCharsTyped;
          if (
            wordIdx < wordsTyped.length &&
            wordsToType[wordIdx].length < wordsTyped[wordIdx].length
          ) {
            extraCharsTyped = wordsTyped[wordIdx]
              .slice(wordsToType[wordIdx].length - wordsTyped[wordIdx].length)
              .split("");
          }
          return (
            <Word key={wordIdx}>
              {/* Characters of the current wordToType */}
              {charsToType.map((char, charIdx) => {
                return (
                  <Character
                    key={`${wordIdx}-${charIdx}`}
                    id={`${wordIdx}-${charIdx}`}
                    char={char}
                    visited={
                      wordIdx <= currWordIdx &&
                      charIdx < wordsTyped[wordIdx].length
                    }
                    correct={
                      wordIdx <= currWordIdx &&
                      charIdx < wordsTyped[wordIdx].length &&
                      char === wordsTyped[wordIdx].charAt(charIdx)
                    }
                    extra={false}
                  />
                );
              })}
              {/* Extra characters extending past the current wordToType */}
              {extraCharsTyped !== undefined &&
                extraCharsTyped.map((char, charIdx) => {
                  return (
                    <Character
                      key={`${wordIdx}-${
                        wordsToType[wordIdx].length + charIdx
                      }`}
                      id={`${wordIdx}-${wordsToType[wordIdx].length + charIdx}`}
                      char={char}
                      visited={true}
                      correct={false}
                      extra={true}
                    />
                  );
                })}
            </Word>
          );
        })}
      </FlexContainer>
    </div>
  );
};

export default TypingTest;

// Styled components
const FlexContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;
const Word = styled.div`
  display: inline-block;
  font-size: 2rem;
  margin: 0.15rem 0.5rem;
  font-family: "Courier New", monospace;
  /* font-family: "Times New Roman", Georgia, serif; */
  /* font-family: Helvetica, Arial, sans-serif; */
  user-select: none;
`;
