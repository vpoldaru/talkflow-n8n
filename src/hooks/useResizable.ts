
import { useRef } from 'react';

export const useResizable = () => {
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  const handleResize = () => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };

  return {
    handleResize,
    resizeTimeoutRef
  };
};
