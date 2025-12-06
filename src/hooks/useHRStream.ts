// @ts-nocheck
import { useEffect, useState } from 'react';

export const useHRStream = () => {
  const [hrPre] = useState(70);
  const [hrv, setHrv] = useState(30);

  useEffect(() => {
    const id = setInterval(() => {
      setHrv(30 + Math.round(Math.random() * 10));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return { hrPre, hrv };
};

export default useHRStream;
