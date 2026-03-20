export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

export type LocaleResources = Record<string, TranslationDictionary>;
