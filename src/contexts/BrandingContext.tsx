
// Add the missing setTheme method to the BrandingContextType interface

export interface BrandingContextType {
  logoUrl: string | null;
  companyName: string | null;
  primaryColor: string;
  accentColor: string;
  customCss: string | null;
  isDarkMode: boolean;
  isLoading: boolean;
  setTheme: (theme: { primaryColor?: string, accentColor?: string }) => void;
}
