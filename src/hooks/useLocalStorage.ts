
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State pour stocker notre valeur
  // Passer la fonction d'initialisation à useState pour qu'elle ne s'exécute qu'une fois
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Récupérer depuis localStorage
      const item = window.localStorage.getItem(key);
      // Parser le JSON stocké ou renvoyer initialValue si vide
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si une erreur se produit, renvoyer initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour localStorage et state
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre aux valeurs d'être une fonction
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Sauvegarder le state
      setStoredValue(valueToStore);
      // Sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Écouter les changements dans d'autres onglets/fenêtres
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
    return undefined;
  }, [key]);

  return [storedValue, setValue] as const;
}

// Exports pour compatibilité
export default useLocalStorage;
