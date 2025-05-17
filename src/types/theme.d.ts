
export type Theme = 
  | "light"
  | "dark"
  | "system"
  | "blue"
  | "green"
  | "violet"
  | "yellow"
  | "rose"
  | "blue-pastel"; // Ajout de cette valeur

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export type FontFamily = 
  | "system"
  | "inter"
  | "manrope"
  | "mono";

export type FontSize = 
  | "sm"
  | "md"
  | "lg"
  | "xl";
