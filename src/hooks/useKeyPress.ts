import { useEffect, useRef } from "react";

// Hook
const useKeyPress = (callback: any) => {
  // Create state for pressed keys
  const keysPressed = useRef<string[]>([]);

  // Add pressed key on keydown
  const downHandler = (event: KeyboardEvent) => {
    const key = event.key;
    // Only add key if not already pressed
    if (!keysPressed.current.includes(key)) {
      keysPressed.current = [...keysPressed.current, key];
      // Only process tab and escape
      if (key === "Tab" || key === "Escape") {
        callback && callback(key);
      }
      // Prevent tab from switching focus, ' and / from opening firefox quick find
      if (key === "Tab" || key === "'" || key === "/") {
        event.preventDefault();
      }
    }
  };

  // Remove pressed key on keyup
  const upHandler = (event: KeyboardEvent) => {
    const key = event.key;
    keysPressed.current = keysPressed.current.filter((k) => k !== key);
  };

  useEffect(() => {
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
  return keysPressed.current;
};

export default useKeyPress;
