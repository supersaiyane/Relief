// src/hooks/useIdleTimer.js
import { useEffect, useRef } from 'react';

/**
 * onIdle:   callback when timeout expires  
 * timeout: ms until idle  
 * active:  boolean, only track if true  
 */
export default function useIdleTimer(onIdle, timeout = 300_000, active = true) {
  const timerId = useRef(null);

  useEffect(() => {
    if (!active) return;
    const resetTimer = () => {
      if (timerId.current) clearTimeout(timerId.current);
      timerId.current = setTimeout(onIdle, timeout);
    };

    const events = ['mousemove','mousedown','keydown','touchstart','scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer(); // start

    return () => {
      clearTimeout(timerId.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [active, onIdle, timeout]);
}
