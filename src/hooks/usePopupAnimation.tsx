import { useState, useEffect } from "react";

export const usePopupAnimation = (isOpen: boolean, duration: number = 450) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  const closeWithAnimation = (onClose: () => void) => {
    setIsAnimating(false);
    setTimeout(() => onClose(), duration);
  };

  return { isAnimating, shouldRender, closeWithAnimation };
};
