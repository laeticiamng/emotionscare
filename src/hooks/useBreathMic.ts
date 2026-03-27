// @ts-nocheck
import { useEffect, useState } from 'react';

export const useBreathMic = () => {
  const [rpm, setRpm] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRpm(10 + Math.round(Math.random() * 4));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return { rpm };
};

export default useBreathMic;
