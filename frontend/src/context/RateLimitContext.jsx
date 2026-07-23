import { createContext, useContext, useState, useCallback, useRef } from "react";

const RateLimitContext = createContext(null);

const COOLDOWN = 60;

export const RateLimitProvider = ({ children }) => {
  const [rateLimited, setRateLimited] = useState(false);
  const [remaining, setRemaining] = useState(COOLDOWN);
  const timerRef = useRef(null);

  const triggerRateLimit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    setRateLimited(true);
    setRemaining(COOLDOWN);

    let count = COOLDOWN;
    timerRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setRateLimited(false);
        setRemaining(0);
      } else {
        setRemaining(count);
      }
    }, 1000);
  }, []);

  return (
    <RateLimitContext.Provider value={{ rateLimited, remaining, triggerRateLimit }}>
      {children}
    </RateLimitContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRateLimit = () => useContext(RateLimitContext);
