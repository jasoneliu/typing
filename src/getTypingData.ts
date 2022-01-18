// Get typing test analytics

export const getNumCharsTyped = (wordsTyped: string[]) => {
  return wordsTyped.join(" ").length;
};

export const getNumErrors = (wordsToType: string[], wordsTyped: string[]) => {
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

    if (currWordToType.length < currWordTyped.length) {
      // extra characters ("alpha" -> "alphaXXX")
      numErrors += currWordTyped.length - currWordToType.length;
    } else if (
      currWordToType.length > currWordTyped.length &&
      wordIdx < wordsTyped.length - 1
    ) {
      // missing characters ("alpha" -> "alp")
      numErrors += currWordToType.length - currWordTyped.length;
    }
  }
  return numErrors;
};

export const getWpm = (
  numCharsTyped: number,
  numErrors: number,
  seconds: number
) => {
  const wpm = (numCharsTyped / 5 - numErrors) / (seconds / 60);
  if (seconds === 0 || wpm < 0) {
    return 0;
  }
  return wpm;
};

export const getAccuracy = (
  totalNumCharsTyped: number,
  totalNumErrors: number
) => {
  if (totalNumCharsTyped === 0) {
    return 100;
  }
  return ((totalNumCharsTyped - totalNumErrors) / totalNumCharsTyped) * 100;
};
