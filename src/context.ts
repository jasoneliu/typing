import React, { createContext } from "react";
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
// linkRestartTest: incremented when a link is clicked, used for restarting test
interface ITestContext {
  timerRunning: boolean;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  linkRestartTest: number;
  setLinkRestartTest: React.Dispatch<React.SetStateAction<number>>;
}
export const TestContext = createContext<ITestContext>({
  timerRunning: false,
  setTimerRunning: () => {},
  linkRestartTest: 0,
  setLinkRestartTest: () => {},
});

// interface ISettingsContext {

// }
// export const SettingsContext = createContext({})
