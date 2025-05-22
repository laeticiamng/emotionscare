
import { useContext } from 'react';
import { ThemeProviderContext, useTheme as useProviderTheme } from '@/providers/ThemeProvider';

export const useTheme = () => {
  // Use the hook from the provider directly
  return useProviderTheme();
};

export default useTheme;
