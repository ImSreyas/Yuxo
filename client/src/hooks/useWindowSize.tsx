import { useState, useEffect, useRef } from "react";

const useWindowSize = (debounceTime = 500) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const debounceTimeout: any = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceTime);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(debounceTimeout.current);
    };
  }, [debounceTime]);

  return windowSize;
};

export default useWindowSize;
