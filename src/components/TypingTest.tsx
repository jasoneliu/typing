import { useState, useRef, useEffect, useContext } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useSession } from "next-auth/client";
import styled from "styled-components";
import produce from "immer";
import Word from "./Word";
import Caret from "./Caret";
import { WPM, Accuracy, Timer, WordCount } from "./TypingData";
import {
  getNumCharsTyped,
  getNumErrors,
  getWpm,
  getAccuracy,
  getTextToType,
} from "../getTypingData";
import useKeyPress from "../hooks/useKeyPress";
import { TestContext, SettingsContext } from "../context";

interface ICaretPosition {
  left: number;
  top: number;
  bottom: number;
}

const TypingTest = () => {
  // Test settings
  const { settings } = useContext(SettingsContext);

  // States of typing text
  const [wordsToType, setWordsToType] = useState<string[]>([""]);
  const [wordsTyped, setWordsTyped] = useState<string[]>([""]);
  const [currWordIdx, setCurrWordIdx] = useState(0);
  const currLineIdx = useRef(0);
  useEffect(() => {
    getTextToType(settings.mode, settings.length[settings.mode]).then((words) =>
      setWordsToType(words)
    );
  }, []);

  // Refs to access updated state in useKeyPress
  const wordsToTypeRef = useRef<string[]>([""]);
  wordsToTypeRef.current = wordsToType;
  const wordsTypedRef = useRef<string[]>([""]);
  wordsTypedRef.current = wordsTyped;
  const currWordIdxRef = useRef<number>(0);
  currWordIdxRef.current = currWordIdx;

  // Timer
  const seconds = useRef(0);
  const timerRunning = useRef(false);
  const [testFinished, setTestFinished] = useState(false);
  // Stop test if timer reaches zero during a timed test
  useEffect(() => {
    if (
      settings.mode === "timed" &&
      parseInt(settings.length.timed) === seconds.current
    ) {
      timerRunning.current = false;
      setTestFinished(true);
    }
  }, [seconds.current]);

  // WPM and Accuracy
  const totalNumCharsTyped = useRef(0);
  const numCharsTyped = useRef(0);
  const totalNumErrors = useRef(0);
  const numErrors = useRef(0); // uncorrected errors
  useEffect(() => {
    numCharsTyped.current = getNumCharsTyped(wordsTypedRef.current);
    numErrors.current = getNumErrors(
      wordsToTypeRef.current,
      wordsTypedRef.current
    );
  }, [wordsTyped]);

  // Update timer, accuracy, and wpm every second
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const updateTypingData = () => {
    unstable_batchedUpdates(() => {
      setWpm(getWpm(numCharsTyped.current, numErrors.current, seconds.current));
      setAccuracy(
        getAccuracy(totalNumCharsTyped.current, totalNumErrors.current)
      );
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning.current) {
        seconds.current++;
        updateTypingData();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Caret
  const [caretPosition, setCaretPosition] =
    useState<ICaretPosition | null>(null);
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
    // Caret is right of current character, unless it's the beginning of a word
    let beginningOfWord = false;
    if (caretCharIdx < 0) {
      beginningOfWord = true;
    }
    // Get positon of char
    const id = caretWordIdx + "-" + Math.max(0, caretCharIdx);
    const element = document.getElementById(id);
    if (element !== null) {
      const position = {
        left: beginningOfWord
          ? element.offsetLeft
          : element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight,
      };
      // Scroll line if the line has changed
      if (caretPosition !== null) {
        if (position.top > caretPosition.top) {
          currLineIdx.current++;
        } else if (
          position.top < caretPosition.top &&
          currLineIdx.current > 0
        ) {
          currLineIdx.current--;
        }
      }
      // Update caret position
      setCaretPosition(position);
    }
  }, [wordsToType, wordsTyped, currWordIdx]);

  // Hide hint when test is running, show when not running
  const { setTimerRunning } = useContext(TestContext);
  useEffect(() => {
    setTimerRunning(timerRunning.current);
  }, [timerRunning.current]);

  // Restart test when link is pressed
  const { linkRestartTest, setSettingsOpen } = useContext(TestContext);
  useEffect(() => {
    // prevent unnecessary restart on first load
    if (linkRestartTest > 0) {
      restartTest();
    }
  }, [linkRestartTest]);

  // Restart test when settings change
  useEffect(() => {
    // prevent unnecessary restart on first load
    return () => restartTest();
  }, [settings]);

  // Fade words back in after restarting test
  const [showWords, setShowWords] = useState(true);
  useEffect(() => {
    setShowWords(true);
  }, [wordsToType]);

  // Reset state and refs after restarting test
  const restartTest = () => {
    timerRunning.current = false;
    totalNumCharsTyped.current = 0;
    numCharsTyped.current = 0;
    totalNumErrors.current = 0;
    numErrors.current = 0;
    currLineIdx.current = 0;

    // fade out words, reset values, then fade back in (with useEffect)
    setShowWords(false);
    setTimeout(() => {
      seconds.current = 0;
      unstable_batchedUpdates(() => {
        setTestFinished(false);
        setWordsTyped([""]);
        setCurrWordIdx(0);
        getTextToType(settings.mode, settings.length[settings.mode]).then(
          (words) => setWordsToType(words)
        );
        setAccuracy(100);
        setWpm(0);
      });
    }, 75);
    return;
  };

  // Submit typing test results when user finishes a test
  const wpmRef = useRef(0);
  wpmRef.current = wpm;
  const accuracyRef = useRef(100);
  accuracyRef.current = accuracy;
  const [session, loading] = useSession();
  const submitData = async () => {
    try {
      const body = {
        punctuation: settings.text.punctuation,
        numbers: settings.text.numbers,
        mode: settings.mode,
        length: settings.length[settings.mode],
        wpm: wpmRef.current,
        accuracy: accuracyRef.current,
      };
      await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (testFinished && session) {
      submitData();
    }
  }, [testFinished]);

  // TODO: "ctrl-backspace" to delete word, "enter" as single key
  // Process key presses
  useKeyPress((key: string) => {
    // Tab: restart test, generate new text
    if (key === "Tab") {
      restartTest();
    }

    // Escape: close settings menu
    if (key === "Escape") {
      setSettingsOpen(false);
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

    // Close settings menu while typing
    setSettingsOpen(false);

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
        updateTypingData();
        setCurrWordIdx((currWordIdx) => currWordIdx + 1);
        timerRunning.current = false;
        setTestFinished(true);
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
      updateTypingData();
      setCurrWordIdx((currWordIdx) => currWordIdx + 1);
      timerRunning.current = false;
      setTestFinished(true);
    }
  });

  return (
    <>
      <TypingTestContainer>
        <TimerWordCountContainer>
          {settings.mode === "timed" ? (
            <Timer
              data={parseInt(settings.length[settings.mode]) - seconds.current}
              visible={timerRunning.current || testFinished}
            />
          ) : (
            <WordCount
              data={[currWordIdx, wordsToType.length]}
              visible={timerRunning.current || testFinished}
            />
          )}
        </TimerWordCountContainer>
        <ShowWords visible={showWords}>
          <WordsContainer currLineIdx={currLineIdx.current}>
            {caretPosition !== null && (
              <Caret
                position={caretPosition}
                blinking={!timerRunning.current}
                smooth={true}
              />
            )}
            {wordsToType.map((word, wordIdx) => (
              <Word
                key={wordIdx}
                currWordIdx={currWordIdx}
                wordIdx={wordIdx}
                wordToType={word}
                wordTyped={wordsTyped[wordIdx]}
              />
            ))}
          </WordsContainer>
        </ShowWords>
        <WPMAccuracyContainer>
          <WPM
            data={Math.round(wpm)}
            visible={timerRunning.current || testFinished}
          />
          <Accuracy
            data={Math.round(accuracy)}
            visible={timerRunning.current || testFinished}
          />
        </WPMAccuracyContainer>
      </TypingTestContainer>
    </>
  );
};

export default TypingTest;

// Container for words and typing test data
const TypingTestContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
`;

// Show three lines of words only
const ShowWords = styled.div<{ visible: boolean }>`
  font-size: 2rem;
  line-height: 2rem;
  height: calc(3 * 2rem + 3 * 0.5em);
  overflow: hidden;

  // fade out, then fade back in when restarting test
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 75ms ease;
`;

// Container for typing test words
const WordsContainer = styled.div<{ currLineIdx: number }>`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  gap: 0.5em 1ch;

  // Smooth scroll animation when moving to new line
  margin-top: ${(props) =>
    props.currLineIdx === 0
      ? 0
      : `calc(${props.currLineIdx - 1} * (2rem + 0.5em) * -1)`};
  padding-top: 0.25em;
  transition: margin-top 150ms ease;
`;

// Show data during typing test
const TimerWordCountContainer = styled.div`
  // position above words
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin-top: -9.5rem;
`;

// Show wpm and accuracy on one line
const WPMAccuracyContainer = styled(TimerWordCountContainer)`
  // put both WPM and accuracy on one line
  display: flex;
  flex-flow: row nowrap;
  gap: 4rem;

  // position below words
  margin-top: 10rem;
`;
