import { useRef } from "react";

const useThrottle = () => {
  const count = useRef(0);

  async function throttle(wait: number = 100) {
    const currentCount = ++count.current;
    await new Promise((res) => setTimeout(res, wait));
    return currentCount === count.current;
  }

  return {
    throttle,
  };
};

export default useThrottle;
