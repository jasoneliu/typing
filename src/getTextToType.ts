// Fetch random typing text

const generateNumber = () => {
  let number = "";
  // number of length 1 to 4
  const length = Math.floor(Math.random() * 4) + 1;
  for (let digitIdx = 0; digitIdx < length; digitIdx++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
};

const getWords = (numWords: number, punctuation: boolean, numbers: boolean) => {
  return fetch("/text/words.json")
    .then((response) => response.json())
    .then((data) => {
      if (numWords < 0) {
        return ["error"];
      }
      const text: string[] = [];
      const wordList: string[] = data["oxford3000"];
      if (numbers) {
        let prevNumberPosition = 2; // prevent numbers within close proximity
        for (let wordIdx = 0; wordIdx < numWords; wordIdx++) {
          if (Math.random() < 0.1 && prevNumberPosition >= 2) {
            text.push(generateNumber());
            prevNumberPosition = 0;
          } else {
            const randIdx = Math.floor(Math.random() * wordList.length);
            text.push(wordList[randIdx]);
            wordList.splice(randIdx, 1); // remove chosen word from list for uniqueness
            prevNumberPosition++;
          }
        }
      } else {
        for (let wordIdx = 0; wordIdx < numWords; wordIdx++) {
          const randIdx = Math.floor(Math.random() * wordList.length);
          text.push(wordList[randIdx]);
          wordList.splice(randIdx, 1); // remove chosen word from list for uniqueness
        }
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

const getTextToType = (
  mode: string,
  length: string,
  punctuation: boolean,
  numbers: boolean
) => {
  switch (mode) {
    case "words":
      return getWords(parseInt(length), punctuation, numbers);
    case "timed":
      // TODO: make data fetching faster for long timed test
      return getWords(parseInt(length) * (200 / 60), punctuation, numbers);
    case "quote":
      return getQuotes(length);
    default:
      console.log("Error: not a valid mode");
      return getWords(-1, punctuation, numbers);
  }
};

export default getTextToType;
