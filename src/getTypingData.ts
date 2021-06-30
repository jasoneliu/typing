// Get typing test analytics

export const getNumCharsTyped = (wordsTyped: string[]) => {
  let numCharsTyped = 0;
  for (let wordIdx = 0; wordIdx < wordsTyped.length; wordIdx++) {
    numCharsTyped += wordsTyped[wordIdx].length + 1; // word + space
  }
  numCharsTyped--; // remove extra trailing space
  return numCharsTyped;
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
    // extra characters
    if (currWordToType.length < currWordTyped.length) {
      numErrors++;
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

// Fetch random typing text

const getWords = (numWords: number) => {
  return fetch("/text/words.json")
    .then((response) => response.json())
    .then((data) => {
      if (numWords < 0) {
        return ["error"];
      }
      const text: string[] = [];
      const wordList: string[] = data["oxford3000"];
      for (let wordIdx = 0; wordIdx < numWords; wordIdx++) {
        const randIdx = Math.floor(Math.random() * wordList.length);
        text.push(wordList[randIdx]);
        wordList.splice(randIdx, 1); // remove chosen word from list for uniqueness
      }
      return text;
    })
    .catch((error) => {
      console.log(error);
      return ["error"];
    });
};

interface IQuote {
  text: string;
  source: string;
  length: number;
  id: number;
}

const numLenToQuoteLen = (length: number) => {
  if (length < 100) {
    return "short";
  }
  if (length < 200) {
    return "medium";
  }
  return "long";
};

const getQuotes = (quoteLength: string) => {
  return fetch("/text/quotes.json")
    .then((response) => response.json())
    .then((data) => {
      let quote: IQuote;
      const quoteList: IQuote[] = data.quotes;
      do {
        const randIdx = Math.floor(Math.random() * quoteList.length);
        quote = quoteList[randIdx];
      } while (
        numLenToQuoteLen(quote.length) !== quoteLength &&
        quoteLength !== "any"
      );
      return quote.text.split(" ");
    })
    .catch((error) => {
      console.log(error);
      return ["error"];
    });
};

export const getTextToType = (mode: string, length: string) => {
  switch (mode) {
    case "words":
      return getWords(parseInt(length));
    case "timed":
      // TODO: make data fetching faster for long timed test
      return getWords(parseInt(length) * (200 / 60));
    case "quote":
      return getQuotes(length);
    default:
      console.log("Error: not a valid mode");
      return getWords(-1);
  }
};
