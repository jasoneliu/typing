import { useState, useEffect } from "react";
import UAParser from "ua-parser-js";

// Determine if user is on a mobile device
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const parser = new UAParser();
    setIsMobile(parser.getResult().device.type === "mobile");
  }, []);

  return isMobile;
};

export default useIsMobile;
