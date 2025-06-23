
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State pour stocker notre valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Récupérer depuis localStorage
      const item = window.localStorage.getItem(key);
      // Parser le JSON stocké ou retourner la valeur initiale
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si erreur, retourner la valeur initiale
      console.log(error);
      return initialValue;
    }
  });

  // Retourner une version wrappée de useState qui persiste la nouvelle valeur dans localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à value d'être une fonction pour avoir la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Sauvegarder l'état
      setStoredValue(valueToStore);
      // Sauvegarder dans localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Une implémentation plus robuste pourrait gérer l'erreur de manière plus nuancée
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}
