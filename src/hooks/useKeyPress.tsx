import { useState, useEffect } from "react";

// Hook
const useKeyPress = (callback) => {
  // Create state for pressed key
  const [keyPressed, setKeyPressed] = useState<string | null>();

  useEffect(() => {
    // Set pressed key on keydown
    const downHandler = (event: KeyboardEvent) => {
      const key = event.key;
      // Only process single keys and backspace, ignoring modifiers
      if (
        key.length === 1 ||
        key === "Backspace" ||
        key === "Tab" ||
        key === "Enter"
      ) {
        setKeyPressed(key);
        callback && callback(key);
      }
      // Prevent spaces from scrolling the page
      // and tab from switching focus
      if (key === " " || key === "Tab") {
        event.preventDefault();
      }
    };
    // Reset pressed key to null on keyup
    const upHandler = () => {
      setKeyPressed(null);
    };

    // Add event listeners for keydown and keyup
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      // Remove event listeners for keydown and keyup after hook unmount
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);
  // Return the pressed key
  return keyPressed;
};

export default useKeyPress;
