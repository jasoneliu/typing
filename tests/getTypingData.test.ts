import { cleanup } from "@testing-library/react";
import {
  getNumCharsTyped,
  getNumErrors,
  getWpm,
  getAccuracy,
} from "../src/getTypingData";

const abc = ["alpha", "bravo", "charlie"];

describe("getTypingData", () => {
  describe("getNumCharsTyped", () => {
    afterEach(cleanup);

    test("no words", () => {
      expect(getNumCharsTyped([""])).toBe(0);
    });
    test("one word", () => {
      expect(getNumCharsTyped(["alpha"])).toBe(5);
    });
    test("multiple words", () => {
      expect(getNumCharsTyped(abc)).toBe(19);
    });
  });

  describe("getNumErrors", () => {
    afterEach(cleanup);

    test("incorrect characters", () => {
      expect(getNumErrors(abc, ["alXXa"])).toBe(2);
    });
    test("missing characters", () => {
      expect(getNumErrors(abc, ["alp", "", "cha"])).toBe(7);
    });
    test("extra characters", () => {
      expect(getNumErrors(abc, ["alphaXXX"])).toBe(3);
    });
    test("multiple words", () => {
      expect(getNumErrors(abc, ["alX", "bravoXXX", "cX"])).toBe(7);
    });
  });

  describe("getWpm", () => {
    afterEach(cleanup);

    test("zero seconds", () => {
      expect(getWpm(10, 5, 0)).toBe(0);
    });
    test("negative wpm", () => {
      expect(getWpm(10, 5, 1)).toBe(0);
    });
    test("standard wpm", () => {
      expect(getWpm(50, 0, 6)).toBe(100);
      expect(getWpm(50, 5, 6)).toBe(50);
    });
  });

  describe("getAccuracy", () => {
    afterEach(cleanup);

    test("zero characters typed", () => {
      expect(getAccuracy(0, 0)).toBe(100);
    });
    test("standard accuracy", () => {
      expect(getAccuracy(100, 0)).toBe(100);
      expect(getAccuracy(100, 5)).toBe(95);
    });
  });
});
