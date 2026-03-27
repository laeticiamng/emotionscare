// @ts-nocheck
export const dict = {
  fr: {
    common: {
      start: "Commencer",
      loading: "Chargement…",
      error: "Une erreur est survenue",
      home: "Accueil"
    }
    // modules: { ... }  // Ajouts optionnels
  },
  en: {
    common: {
      start: "Start",
      loading: "Loading…",
      error: "An error occurred",
      home: "Home"
    }
  }
};
export type Lang = keyof typeof dict;
