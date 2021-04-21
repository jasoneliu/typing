import React, { useState, useRef, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";
import Word from "./Word";
import Caret from "./Caret";
import useKeyPress from "../hooks/useKeyPress";
import styled from "styled-components";
import produce from "immer";

interface CaretPositionProps {
  left: number;
  top: number;
}

// Fetch random typing text
const server =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://www.jasoneliu.com";
const fetchWordsToType = (numWords: number, source: string) => {
  return fetch(`${server}/text/words.json`)
    .then((response) => response.json())
    .then((data) => {
      let text = "";
      const wordList: string[] = data[source];
      const wordListLen = wordList.length;
      for (let wordIdx = 0; wordIdx < numWords; wordIdx++) {
        const randIdx = Math.floor(Math.random() * wordListLen);
        text += wordList[randIdx] + " ";
      }
      return text.trim().split(" ");
    })
    .catch((error) => {
      return error;
    });
};

const getNumCharsTyped = (wordsTyped: string[]) => {
  let numCharsTyped = 0;
  for (let wordIdx = 0; wordIdx < wordsTyped.length; wordIdx++) {
    numCharsTyped += wordsTyped[wordIdx].length + 1; // word + space
  }
  numCharsTyped--; // remove extra trailing space
  return numCharsTyped;
};

const getNumErrors = (wordsToType: string[], wordsTyped: string[]) => {
  let numErrors = 0;
  for (let wordIdx = 0; wordIdx < wordsTyped.length; wordIdx++) {
    const currWordToType = wordsToType[wordIdx];
    const currWordTyped = wordsTyped[wordIdx];
    // all non-extra typed characters
    for (
      let charIdx = 0;
      charIdx < Math.min(currWordToType.length, currWordTyped.length);
      charIdx++
    ) {
      if (currWordToType[charIdx] !== currWordTyped[charIdx]) {
        numErrors++;
      }
    }
    // extra characters
    if (currWordToType.length < currWordTyped.length) {
      numErrors++;
    }
  }
  return numErrors;
};

const getAccuracy = (totalNumCharsTyped: number, totalNumErrors: number) => {
  if (totalNumCharsTyped === 0) {
    return 100;
  }
  return ((totalNumCharsTyped - totalNumErrors) / totalNumCharsTyped) * 100;
};

const getWpm = (numCharsTyped: number, numErrors: number, seconds: number) => {
  const wpm = (numCharsTyped / 5 - numErrors) / (seconds / 60);
  if (seconds === 0 || wpm < 0) {
    return 0;
  }
  return wpm;
};

const TypingTest: React.FC = () => {
  // States of typing text
  const [numWords, setNumWords] = useState(50);
  const [textSource, setTextSource] = useState("oxford3000");
  const [wordsToType, setWordsToType] = useState<string[]>([""]);
  const [wordsTyped, setWordsTyped] = useState<string[]>([""]);
  const [currWordIdx, setCurrWordIdx] = useState(0);
  useEffect(() => {
    fetchWordsToType(numWords, textSource).then((words) =>
      setWordsToType(words)
    );
  }, []);

  // Timer
  const [seconds, setSeconds] = useState(0);
  const secondsRef = useRef(0);
  secondsRef.current = seconds;
  const timerRunning = useRef(false);

  // Refs to access updated state in useKeyPress
  const wordsToTypeRef = useRef<string[]>([""]);
  wordsToTypeRef.current = wordsToType;
  const wordsTypedRef = useRef<string[]>([""]);
  wordsTypedRef.current = wordsTyped;
  const currWordIdxRef = useRef<number>(0);
  currWordIdxRef.current = currWordIdx;

  // WPM and Accuracy
  const totalNumCharsTyped = useRef(0);
  const numCharsTyped = useRef(0);
  const totalNumErrors = useRef(0);
  const numErrors = useRef(0); // uncorrected errors
  const accuracy = useRef(100);
  const wpm = useRef(0);
  useEffect(() => {
    numCharsTyped.current = getNumCharsTyped(wordsTypedRef.current);
    numErrors.current = getNumErrors(
      wordsToTypeRef.current,
      wordsTypedRef.current
    );
  }, [wordsTyped]);

  // Update timer, accuracy, and wpm every second
  const [updatedAccuracy, setUpdatedAccuracy] = useState(100);
  const [updatedWpm, setUpdatedWpm] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning.current) {
        setSeconds((seconds) => seconds + 1);
        unstable_batchedUpdates(() => {
          setUpdatedAccuracy(
            getAccuracy(totalNumCharsTyped.current, totalNumErrors.current)
          );
          setUpdatedWpm(
            getWpm(numCharsTyped.current, numErrors.current, secondsRef.current)
          );
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Caret
  const [caretPosition, setCaretPosition] = useState<CaretPositionProps | null>(
    null
  );
  // Update caret position
  useEffect(() => {
    // Make sure currWordIdx is in bounds after test ends
    let caretWordIdx = currWordIdxRef.current;
    if (currWordIdxRef.current >= wordsToTypeRef.current.length) {
      caretWordIdx = wordsToTypeRef.current.length - 1;
    }
    // Make sure caret moves correctly after test ends
    let caretCharIdx = wordsTypedRef.current[caretWordIdx].length - 1;
    if (
      caretWordIdx === wordsToTypeRef.current.length - 1 &&
      !timerRunning.current
    ) {
      caretCharIdx = Math.max(
        caretCharIdx,
        wordsToTypeRef.current[caretWordIdx].length - 1
      );
    }
    // Caret is right of character, unless it's the beginning of a word
    let beginningOfWord = false;
    if (caretCharIdx < 0) {
      beginningOfWord = true;
    }
    // Get positon of char
    const id = caretWordIdx + "-" + Math.max(0, caretCharIdx);
    const element = document.getElementById(id);
    if (element !== null) {
      const rect = element.getBoundingClientRect();
      const position = {
        left: beginningOfWord ? rect.left : rect.right,
        top: rect.top,
      };
      setCaretPosition(position);
    }
  }, [wordsToType, wordsTyped, currWordIdx]);

  // TODO: "ctrl-backspace" to delete word, "enter" as single key
  // Process key presses
  useKeyPress((key: string) => {
    // Tab: restart test, generate new text
    if (key === "Tab") {
      timerRunning.current = false;
      totalNumCharsTyped.current = 0;
      numCharsTyped.current = 0;
      totalNumErrors.current = 0;
      numErrors.current = 0;
      accuracy.current = 100;
      wpm.current = 0;
      unstable_batchedUpdates(() => {
        setWordsTyped([""]);
        setCurrWordIdx(0);
        setSeconds(0);
        fetchWordsToType(numWords, textSource).then((words) =>
          setWordsToType(words)
        );
        setUpdatedAccuracy(100);
        setUpdatedWpm(0);
      });
      return;
    }

    // Start test if key is first char typed
    if (
      wordsTypedRef.current[0] === "" &&
      currWordIdxRef.current === 0 &&
      key.length === 1
    ) {
      timerRunning.current = true;
    }
    // Stop processing keypresses when test is finished
    if (!timerRunning.current) {
      return;
    }

    // Backspace:
    if (key === "Backspace") {
      // If current word not empty, backspace (delete last character)
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
      return;
    }

    // Add to number of characters typed
    totalNumCharsTyped.current++;

    // Space:
    const currWordToType = wordsToTypeRef.current[currWordIdxRef.current];
    const currCharIdx = wordsTypedRef.current[currWordIdxRef.current].length;
    if (key === " ") {
      // Add to errors if incorrect
      if (currCharIdx < currWordToType.length) {
        totalNumErrors.current++;
      }
      // Stop test if last word
      if (currWordIdxRef.current === wordsToTypeRef.current.length - 1) {
        setCurrWordIdx((currWordIdx) => currWordIdx + 1);
        timerRunning.current = false;
      }
      // Go to next word
      else {
        unstable_batchedUpdates(() => {
          setWordsTyped((currWordsTyped) => {
            return currWordsTyped.concat("");
          });
          setCurrWordIdx((currWordIdx) => currWordIdx + 1);
        });
      }
      return;
    }

    // Regular keys:
    // Add to errors if incorrect
    if (currCharIdx >= currWordToType.length) {
      totalNumErrors.current++;
    } else if (key !== currWordToType[currCharIdx]) {
      totalNumErrors.current++;
    }
    // Add character to end of current word
    setWordsTyped((currWordsTyped) => {
      return produce(currWordsTyped, (nextWordsTyped) => {
        const currWord = currWordsTyped[currWordIdxRef.current];
        const newCurrWord = currWord + key;
        nextWordsTyped[currWordIdxRef.current] = newCurrWord;
      });
    });
    // Stop test if last word is correct
    if (
      currWordIdxRef.current === wordsToTypeRef.current.length - 1 &&
      wordsTypedRef.current[currWordIdxRef.current] ===
        wordsToTypeRef.current[currWordIdxRef.current]
    ) {
      setCurrWordIdx((currWordIdx) => currWordIdx + 1);
      timerRunning.current = false;
    }
  });

  return (
    <div>
      <div>Timer: {seconds}</div>
      <div>
        Words typed: {currWordIdx}/{wordsToType.length}
      </div>
      <div>WPM: {`${Math.round(updatedWpm)}`}</div>
      <div>Accuracy: {`${Math.round(updatedAccuracy)}%`}</div>
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
          return (
            <Word
              key={wordIdx}
              currWordIdx={currWordIdx}
              wordIdx={wordIdx}
              wordToType={word}
              wordTyped={wordsTyped[wordIdx]}
            />
          );
        })}
      </FlexContainer>
    </div>
  );
};

export default TypingTest;

const FlexContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;