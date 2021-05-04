import { useEffect, useRef } from "react";

const modifiers = ["Control", "Alt", "Fn", "Meta"];

// Hook
const useKeyPress = (callback: any) => {
  // Create state for pressed keys
  // const [keysPressed, setKeysPressed] = useState<string[]>([]);
  const keysPressed = useRef<string[]>([]);

  // Add pressed key on keydown
  const downHandler = (event: KeyboardEvent) => {
    const key = event.key;
    // Only add key if not already pressed
    if (!keysPressed.current.includes(key)) {
      keysPressed.current = [...keysPressed.current, key];
      // Only process single keys (alphanumeric), backspace, and tab
      // Ignore all keys when pressed with modifiers (besides shift)
      if (
        (key.length === 1 || key === "Backspace" || key === "Tab") &&
        !modifiers.some((k) => keysPressed.current.includes(k))
      ) {
        callback && callback(key);
      }
      // Prevent spaces from scrolling the page and tab from switching focus
      if (key === " " || key === "Tab") {
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
