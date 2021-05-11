import React, { createContext } from "react";
import { themeType } from "./themes";

interface IThemeContext {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<themeType>>;
}
export const ThemeContext = createContext<IThemeContext>({
  theme: "dark",
  setTheme: () => {},
});

interface ITestContext {
  timerRunning: boolean;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
}
export const TestContext = createContext<ITestContext>({
  timerRunning: false,
  setTimerRunning: () => {},
});

// interface ISettingsContext {

// }
// export const SettingsContext = createContext({})
