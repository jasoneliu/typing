// Fetch random typing text

// generates a random number of length 1 to 4
const generateNumber = () => {
  let number = "";
  const length = Math.floor(Math.random() * 4) + 1;
  for (let digitIdx = 0; digitIdx < length; digitIdx++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
};

const capitalizeWord = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// adds random punctuation to a single word
// punctuation: .,?!;:"'-() caps
const addPunctuationToWord = (text: string[], wordIdx: number) => {
  const rand = Math.random() * 100;
  switch (true) {
    case rand < 40: // ending punctuation .?!
      if (rand < 30) {
        text[wordIdx] += "."; // . 30%
      } else if (rand < 35) {
        text[wordIdx] += "?"; // ? 5%
      } else {
        text[wordIdx] += "!"; // ! 5%
      }
      // capitalize next word
      if (wordIdx < text.length - 1) {
        text[wordIdx + 1] = capitalizeWord(text[wordIdx + 1]);
      }
      return text;
    case rand < 75:
      text[wordIdx] += ","; // , 35%
      return text;
    case rand < 80:
      text[wordIdx] += ";"; // ; 5%
      return text;
    case rand < 85:
      text[wordIdx] += ":"; // : 5%
      return text;
    case rand < 90:
      text[wordIdx] = "'" + text[wordIdx] + "'"; // '' 5%
      return text;
    case rand < 95:
      text[wordIdx] = '"' + text[wordIdx] + '"'; // "" 5%
      return text;
    case rand < 100:
      text[wordIdx] = "(" + text[wordIdx] + ")"; // () 5%
      return text;
    default:
      // no punctuation
      return text;
  }
};

// adds random punctuation (capitals and symbols) to text
const addPunctuation = (text: string[]) => {
  text[0] = capitalizeWord(text[0]); // capitalize first word
  let prevPuncPosition = 2; // prevent punctuation within close proximity
  for (let wordIdx = 1; wordIdx < text.length; wordIdx++) {
    if (Math.random() < 0.3 && prevPuncPosition >= 2) {
      addPunctuationToWord(text, wordIdx);
      prevPuncPosition = 0;
    } else {
      prevPuncPosition++;
    }
  }
  return text;
};

// fetches a given number of random words
const getWords = (numWords: number, punctuation: boolean, numbers: boolean) => {
  return fetch("/text/words.json")
    .then((response) => response.json())
    .then((data) => {
      if (numWords < 0) {
        return ["error"];
      }
      const text: string[] = [];
      const wordList: string[] = data["oxford3000"];
      // add random numbers
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
      // add random punctuation (capitals and symbols)
      if (punctuation) {
        addPunctuation(text);
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

// converts an integer length (number of characters) to quote length (short, medium, long)
export const numLenToQuoteLen = (length: number) => {
  if (length < 100) {
    return "short";
  }
  if (length < 200) {
    return "medium";
  }
  return "long";
};

// fetches a quote of given length
const getQuote = (quoteLength: string) => {
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
      console.log(numLenToQuoteLen(quote.length));
      return quote.text.split(" ");
    })
    .catch((error) => {
      console.log(error);
      return ["error"];
    });
};

// fetches text of given mode, length, and text settings
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
      return getQuote(length);
    default:
      console.log("Error: not a valid mode");
      return getWords(-1, punctuation, numbers);
  }
};

export default getTextToType;
