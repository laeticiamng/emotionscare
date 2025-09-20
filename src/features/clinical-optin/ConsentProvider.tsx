import React, { createContext, useContext, useMemo, useState } from 'react';

interface ConsentContextValue {
  clinicalAccepted: boolean;
  setClinicalAccepted: (accepted: boolean) => void;
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export const ConsentProvider: React.FC<{ children: React.ReactNode; defaultAccepted?: boolean }> = ({
  children,
  defaultAccepted = true,
}) => {
  const [clinicalAccepted, setClinicalAccepted] = useState(defaultAccepted);

  const value = useMemo(
    () => ({ clinicalAccepted, setClinicalAccepted }),
    [clinicalAccepted],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    return {
      clinicalAccepted: true,
      setClinicalAccepted: () => {},
    };
  }
  return context;
};
