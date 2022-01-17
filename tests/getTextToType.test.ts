import { cleanup } from "@testing-library/react";
import axios from "axios";
import getTextToType from "../src/getTextToType";
import { numLenToQuoteLen } from "../src/getTextToType";

// Determines if any words contain punctuation
const hasPunctuation = (words: string[]) => {
  for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
    if (!words[wordIdx].match(/^[a-z0-9']+$/)) {
      return true;
    }
  }
  return false;
};

// Determines if any words are numbers
const hasNumbers = (words: string[]) => {
  for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
    if (words[wordIdx].match(/^[0-9]+$/)) {
      return true;
    }
  }
  return false;
};

// Returns a deep copy of the given object
const copy = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};

// Mock jsons requested by axios.get
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getTextToType", () => {
  describe("mode: words", () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue(copy(mockedWords));
    });
    afterEach(cleanup);

    test.each([
      [10, false, false],
      [25, false, false],
      [50, false, false],
      [100, false, false],
      [100, true, true],
    ])(
      "length %p, punctuation %p, numbers %p",
      async (length: number, punctuation: boolean, numbers: boolean) => {
        const textToType = await getTextToType(
          "words",
          length.toString(),
          punctuation,
          numbers
        );
        expect(mockedAxios.get).toHaveBeenCalledWith("/text/words.json");
        expect(textToType.length).toBe(length);
        expect(hasPunctuation(textToType)).toBe(punctuation);
        expect(hasNumbers(textToType) || numbers).toBe(numbers);
      }
    );
  });

  describe("mode: timed", () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue(copy(mockedWords));
    });
    afterEach(cleanup);

    test.each([
      [15, false, false],
      [30, false, false],
      [60, false, false],
      [120, false, false],
      [120, true, true],
    ])(
      "length %ps, punctuation %p, numbers %p",
      async (length: number, punctuation: boolean, numbers: boolean) => {
        const textToType = await getTextToType(
          "timed",
          length.toString(),
          punctuation,
          numbers
        );
        expect(mockedAxios.get).toHaveBeenCalledWith("/text/words.json");
        expect(textToType.length).toBe(length * (200 / 60));
        expect(hasPunctuation(textToType)).toBe(punctuation);
        expect(hasNumbers(textToType) || numbers).toBe(numbers);
      }
    );
  });

  describe("mode: quotes", () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue(copy(mockedQuotes));
    });
    afterEach(cleanup);

    test.each([
      ["short", false, false],
      ["medium", false, false],
      ["long", false, false],
      ["any", false, false],
      ["any", true, true],
    ])(
      "length %p, punctuation %p, numbers %p",
      async (length: string, punctuation: boolean, numbers: boolean) => {
        const textToType = await getTextToType(
          "quote",
          length,
          punctuation,
          numbers
        );
        expect(mockedAxios.get).toHaveBeenCalledWith("/text/quotes.json");
        expect([
          numLenToQuoteLen(textToType.join(" ").length),
          "any",
        ]).toContain(length);
        expect(hasPunctuation(textToType)).toBe(punctuation);
        expect(hasNumbers(textToType) || numbers).toBe(numbers);
      }
    );
  });
});

// Mocked text data

const mockedWords = {
  data: {
    oxford3000: [
      "a",
      "an",
      "abandon",
      "ability",
      "able",
      "about",
      "above",
      "abroad",
      "absolute",
      "absolutely",
      "academic",
      "accept",
      "acceptable",
      "access",
      "accident",
      "accommodation",
      "accompany",
      "according",
      "account",
      "accurate",
      "accuse",
      "achieve",
      "achievement",
      "acknowledge",
      "acquire",
      "across",
      "act",
      "action",
      "active",
      "activity",
      "actor",
      "actress",
      "actual",
      "actually",
      "ad",
      "adapt",
      "add",
      "addition",
      "additional",
      "address",
      "administration",
      "admire",
      "admit",
      "adopt",
      "adult",
      "advance",
      "advanced",
      "advantage",
      "adventure",
      "advertise",
      "advertisement",
      "advertising",
      "advice",
      "advise",
      "affair",
      "affect",
      "afford",
      "afraid",
      "after",
      "afternoon",
      "afterwards",
      "again",
      "against",
      "age",
      "aged",
      "agency",
      "agenda",
      "agent",
      "aggressive",
      "ago",
      "agree",
      "agreement",
      "ahead",
      "aid",
      "aim",
      "air",
      "aircraft",
      "airline",
      "airport",
      "alarm",
      "album",
      "alcohol",
      "alcoholic",
      "alive",
      "all",
      "allow",
      "almost",
      "alone",
      "along",
      "already",
      "also",
      "alter",
      "alternative",
      "although",
      "always",
      "amazed",
      "amazing",
      "ambition",
      "ambitious",
      "among",
      "amount",
      "analyse",
      "analysis",
      "ancient",
      "and",
      "anger",
      "angle",
      "angrily",
      "angry",
      "animal",
      "ankle",
      "anniversary",
      "announce",
      "announcement",
      "annoy",
      "annoyed",
      "annoying",
      "annual",
      "another",
      "answer",
      "anxious",
      "any",
      "anymore",
      "anybody",
      "anyone",
      "anything",
      "anyway",
      "anywhere",
      "apart",
      "apartment",
      "apologize",
      "app",
      "apparent",
      "apparently",
      "appeal",
      "appear",
      "appearance",
      "apple",
      "application",
      "apply",
      "appointment",
      "appreciate",
      "approach",
      "appropriate",
      "approval",
      "approve",
      "approximately",
      "april",
      "architect",
      "architecture",
      "area",
      "argue",
      "argument",
      "arise",
      "arm",
      "armed",
      "arms",
      "army",
      "around",
      "arrange",
      "arrangement",
      "arrest",
      "arrival",
      "arrive",
      "art",
      "article",
      "artificial",
      "artist",
      "artistic",
      "as",
      "ashamed",
      "ask",
      "asleep",
      "aspect",
      "assess",
      "assessment",
      "assignment",
      "assist",
      "assistant",
      "associate",
      "associated",
      "association",
      "assume",
      "at",
      "athlete",
      "atmosphere",
      "attach",
      "attack",
      "attempt",
      "attend",
      "attention",
      "attitude",
      "attract",
      "attraction",
      "attractive",
      "audience",
      "august",
      "aunt",
      "author",
      "authority",
      "autumn",
      "available",
      "average",
      "avoid",
      "award",
      "aware",
      "away",
      "awful",
      "baby",
      "back",
      "background",
      "backwards",
      "bacteria",
      "bad",
      "badly",
      "bag",
      "bake",
      "balance",
      "ball",
      "ban",
      "banana",
      "band",
      "bank",
      "bar",
      "barrier",
      "base",
      "baseball",
      "based",
      "basic",
      "basically",
      "basis",
      "basketball",
      "bath",
      "bathroom",
      "battery",
      "battle",
      "be",
      "beach",
      "bean",
      "bear",
      "beat",
      "beautiful",
      "beauty",
      "because",
      "become",
      "bed",
      "bedroom",
      "bee",
      "beef",
      "beer",
      "before",
      "beg",
      "begin",
      "beginning",
      "behave",
      "behavior",
      "behind",
      "being",
      "belief",
      "believe",
      "bell",
      "belong",
      "below",
      "belt",
      "bend",
      "benefit",
      "bent",
      "best",
      "bet",
      "better",
      "between",
      "beyond",
      "bicycle",
      "big",
      "bike",
      "bill",
      "billion",
      "bin",
      "biology",
      "bird",
      "birth",
      "birthday",
      "biscuit",
      "bit",
      "bite",
      "bitter",
      "black",
      "blame",
      "blank",
      "blind",
      "block",
      "blog",
      "blonde",
      "blood",
      "blow",
      "blue",
      "board",
      "boat",
      "body",
      "boil",
      "bomb",
      "bond",
      "bone",
      "book",
      "boot",
      "border",
      "bored",
      "boring",
      "born",
      "borrow",
      "boss",
      "both",
      "bother",
      "bottle",
      "bottom",
      "bowl",
      "box",
      "boy",
      "boyfriend",
      "brain",
      "branch",
      "brand",
      "brave",
      "bread",
      "break",
      "breakfast",
      "breast",
      "breath",
      "breathe",
      "breathing",
      "bride",
      "bridge",
      "brief",
      "bright",
      "brilliant",
      "bring",
      "broad",
      "broadcast",
      "broken",
      "brother",
      "brown",
      "brush",
      "bubble",
      "budget",
      "build",
      "building",
      "bullet",
      "bunch",
      "burn",
      "bury",
      "bus",
      "bush",
      "business",
      "businessman",
      "busy",
      "but",
      "butter",
      "button",
      "buy",
      "by",
      "bye",
      "cable",
      "cafe",
      "cake",
      "calculate",
      "call",
      "calm",
      "camera",
      "camp",
      "campaign",
      "camping",
      "campus",
      "can",
      "cancel",
      "cancer",
      "candidate",
      "cannot",
      "cap",
      "capable",
      "capacity",
      "capital",
      "captain",
      "capture",
      "car",
      "card",
      "care",
      "career",
      "careful",
      "carefully",
      "careless",
      "carpet",
      "carrot",
      "carry",
      "cartoon",
      "case",
      "cash",
      "cast",
      "castle",
      "cat",
      "catch",
    ],
  },
};

const mockedQuotes = {
  data: {
    quotes: [
      {
        text: "You have the power to heal your life, and you need to know that.",
        source: "Meditations to Heal Your Life",
        length: 64,
        id: 1,
      },
      {
        text: "Yeah it's you, you're the one that makes me feel right. I've been in love with her for ages and I can't seem to get it right. I fell in love with her in stages my whole life.",
        source: "Me and You Together Song",
        id: 26,
        length: 174,
      },
      {
        text: "She dreams of 1969 before the soldiers came. The life was cheap on bread and wine and sharing meant no shame. She is awakened by the screams of rockets flying from nearby, and scared she clings onto her dreams to beat the fear that she might die.",
        source: "The Lebanon",
        id: 2369,
        length: 246,
      },
      {
        text: "She did not tell them to clean up their lives, or go and sin no more. She did not tell them they were the blessed of the earth, its inheriting meek, or its glory-bound pure. She told them that the only grace they could have is the grace they could imagine. That if they could not see it, they could not have it.",
        source: "Beloved",
        id: 149,
        length: 311,
      },
    ],
  },
};