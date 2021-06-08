import { createContext } from "react";
import { themeType } from "./themes";

// change global theme
interface IThemeContext {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<themeType>>;
}
export const ThemeContext = createContext<IThemeContext>({
  theme: "dark",
  setTheme: () => {},
});

// timerRunning: used for keytip visibility
// linkRestartTest: incremented when link to home page is clicked, used for restarting test
// settingsOpen: when the settings drowdown menu is open
interface ITestContext {
  timerRunning: boolean;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  linkRestartTest: number;
  setLinkRestartTest: React.Dispatch<React.SetStateAction<number>>;
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const TestContext = createContext<ITestContext>({
  timerRunning: false,
  setTimerRunning: () => {},
  linkRestartTest: 0,
  setLinkRestartTest: () => {},
  settingsOpen: false,
  setSettingsOpen: () => {},
});

export type ModeType = "timed" | "words" | "quotes"; //| "lyrics" | "books" | "code";
interface ISettings {
  text: { punctuation: boolean; numbers: boolean };
  mode: ModeType;
  length: {
    timed: string;
    words: string;
    quotes: string;
    lyrics: string;
    books: string;
    code: string;
  };
}
interface ISettingsContext {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
}
export const SettingsContext = createContext<ISettingsContext>({
  settings: {
    text: { punctuation: false, numbers: false },
    mode: "words",
    length: {
      timed: "30",
      words: "50",
      quotes: "medium",
      lyrics: "medium",
      books: "medium",
      code: "medium",
    },
  },
  setSettings: () => {},
});
