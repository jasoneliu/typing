// Fetch random typing text

// Generates a random number of length 1 to 4
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

// Adds random punctuation to a single word
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

// Adds random punctuation (capitals and symbols) to text
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

// Fetches a given number of random words
const getWords = async (
  numWords: number,
  punctuation: boolean,
  numbers: boolean
) => {
  try {
    const response = await fetch("/text/words.json");
    const data = await response.json();
    const text: string[] = [];
    const wordList: string[] = data["oxford3000"];

    if (numWords < 0) {
      return ["error"];
    }

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
  } catch (error) {
    console.log(error);
    return ["error"];
  }
};

interface IQuote {
  text: string;
  source: string;
  length: number;
  id: number;
}

// Converts an integer length (number of characters) to quote length (short, medium, long)
export const numLenToQuoteLen = (length: number) => {
  if (length < 150) {
    return "short";
  }
  if (length < 300) {
    return "medium";
  }
  return "long";
};

// Randomly choose quote length
const randomQuoteLength = () => {
  const rand = Math.floor(Math.random() * 3);
  switch (rand) {
    case 0:
      return "short";
    case 1:
      return "medium";
    case 2:
      return "long";
    default:
      return "medium";
  }
};

// Returns whether text contains a number
const containsNumber = (text: string) => {
  const textNoNumbers = text.replace(/[0-9]/g, "");
  return text !== textNoNumbers;
};

// Remove all punctuation from text
const removePunctuation = (text: string) => {
  text = text.toLowerCase();
  text = text.replace("-", " "); // replace hypens with spaces
  text = text.replace(/[^0-9a-z' ]/g, ""); // remove punctuation besides '
  text = text.replace(/  +/g, " "); // remove adjacent spaces
  const words = text.split(" ");

  // remove ' at the ends of words, but not apostrophes
  for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
    let word = words[wordIdx];
    if (word.includes("'")) {
      // remove ' at beginning of word
      if (word[0] === "'") {
        word = word.slice(0);
      }
      // remove ' at end of word
      if (word[word.length - 1] === "'") {
        word = word.slice(0, -1);
      }
      words[wordIdx] = word;
    }
  }

  return words;
};

// Fetches a quote of given length
const getQuote = async (
  quoteLength: string,
  punctuation: boolean,
  numbers: boolean
) => {
  try {
    const response = await fetch("/text/quotes.json");
    const data = await response.json();
    const quoteList: IQuote[] = data.quotes;
    let quote: IQuote;

    // when length is "any", choose length short/medium/long with equal possibility
    if (quoteLength === "any") {
      quoteLength = randomQuoteLength();
    }

    // find quote of desired length
    do {
      const randIdx = Math.floor(Math.random() * quoteList.length);
      quote = quoteList[randIdx];
    } while (
      numLenToQuoteLen(quote.length) !== quoteLength || // desired length
      (!numbers && containsNumber(quote.text)) || // exclude quotes with numbers if desired
      quote.length > 600 // quote not too long
    );

    // remove punctuation if desired
    if (!punctuation) {
      return removePunctuation(quote.text);
    }

    return quote.text.split(" ");
  } catch (error) {
    console.log(error);
    return ["error"];
  }
};

// Fetches text of given mode, length, and text settings
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
      return getWords(parseInt(length) * (200 / 60), punctuation, numbers);
    case "quote":
      return getQuote(length, punctuation, numbers);
    default:
      console.log("Error: not a valid mode");
      return getWords(-1, punctuation, numbers);
  }
};

export default getTextToType;
