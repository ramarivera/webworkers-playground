import { useEffect, useRef, useState } from 'react';

export const useExecuteExactlyOnce = (callback: () => Promise<void>) => {
  const hasExecuted = useRef(false);
  const isExecuting = useRef(false);
  const executingPromiseRef = useRef<Promise<void>>();
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!hasExecuted.current && !isExecuting.current) {
      isExecuting.current = true;
      executingPromiseRef.current = callback().then(() => {
        hasExecuted.current = true;
        isExecuting.current = false;
        setIsDone(true);
      });
    } else {
      setIsDone(true);
    }
  }, [callback]);

  return {
    isDone: isDone,
    waitUntilCompletion: () => executingPromiseRef.current ?? Promise.reject(),
  };
};

export const useTimeout = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };
    if (delay !== null) {
      const id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};
