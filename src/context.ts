import React, { createContext } from "react";

// const SettingsContext = createContext({})

interface ITestContext {
  timerRunning: boolean;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
}
const TestContext = createContext<ITestContext>({
  timerRunning: false,
  setTimerRunning: () => {},
});

export default TestContext;
