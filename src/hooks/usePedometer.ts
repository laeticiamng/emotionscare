import { useEffect, useState } from 'react';

export const usePedometer = () => {
  const [cadence, setCadence] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCadence(60 + Math.round(Math.random() * 20));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return { cadence };
};

export default usePedometer;
