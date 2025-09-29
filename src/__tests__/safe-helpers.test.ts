import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  ensureSet,
  safeAdd,
  safeClassAdd,
  safeClassRemove,
  safeClassToggle,
  must,
  ensureMap,
  safeMapSet,
  ensureArray,
  safePush,
  safeGetElement,
  safeGetDocumentRoot,
  safeDOM,
  hasAddMethod,
  safeAddToCollection
} from '../lib/safe-helpers';

describe('Safe Helpers - Prévention des erreurs "Cannot read properties of undefined"', () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = {
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    consoleSpy.warn.mockRestore();
    consoleSpy.error.mockRestore();
  });

  describe('ensureSet', () => {
    it('devrait retourner un Set vide si undefined', () => {
      const result = ensureSet(undefined);
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });

    it('devrait retourner un Set vide si null', () => {
      const result = ensureSet(null);
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });

    it('devrait retourner le Set existant si valide', () => {
      const originalSet = new Set(['a', 'b']);
      const result = ensureSet(originalSet);
      expect(result).toBe(originalSet);
      expect(result.size).toBe(2);
    });
  });

  describe('safeAdd', () => {
    it('devrait créer un nouveau Set et ajouter l\'élément si undefined', () => {
      const result = safeAdd(undefined, 'test');
      expect(result).toBeInstanceOf(Set);
      expect(result.has('test')).toBe(true);
    });

    it('devrait ajouter à un Set existant', () => {
      const existingSet = new Set(['existing']);
      const result = safeAdd(existingSet, 'new');
      expect(result).toBe(existingSet);
      expect(result.has('existing')).toBe(true);
      expect(result.has('new')).toBe(true);
    });

    it('ne devrait jamais lancer d\'erreur même avec des valeurs nulles', () => {
      expect(() => safeAdd(null, 'test')).not.toThrow();
      expect(() => safeAdd(undefined, 'test')).not.toThrow();
    });
  });

  describe('safeClassAdd', () => {
    let mockElement: any;

    beforeEach(() => {
      mockElement = {
        classList: {
          add: vi.fn(),
        }
      };
    });

    it('devrait ajouter des classes à un élément valide', () => {
      safeClassAdd(mockElement, 'class1', 'class2');
      expect(mockElement.classList.add).toHaveBeenCalledWith('class1', 'class2');
    });

    it('ne devrait pas planter si l\'élément est null', () => {
      expect(() => safeClassAdd(null, 'test')).not.toThrow();
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('ne devrait pas planter si l\'élément est undefined', () => {
      expect(() => safeClassAdd(undefined, 'test')).not.toThrow();
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('ne devrait pas planter si classList est undefined', () => {
      const elementWithoutClassList = {};
      expect(() => safeClassAdd(elementWithoutClassList as any, 'test')).not.toThrow();
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('devrait filtrer les classes vides', () => {
      safeClassAdd(mockElement, 'class1', '', 'class2', null as any, undefined as any);
      expect(mockElement.classList.add).toHaveBeenCalledWith('class1', 'class2');
    });

    it('devrait gérer les erreurs de classList.add', () => {
      mockElement.classList.add = vi.fn().mockImplementation(() => {
        throw new Error('classList error');
      });
      
      expect(() => safeClassAdd(mockElement, 'test')).not.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('safeClassRemove', () => {
    let mockElement: any;

    beforeEach(() => {
      mockElement = {
        classList: {
          remove: vi.fn(),
        }
      };
    });

    it('devrait retirer des classes d\'un élément valide', () => {
      safeClassRemove(mockElement, 'class1', 'class2');
      expect(mockElement.classList.remove).toHaveBeenCalledWith('class1', 'class2');
    });

    it('ne devrait pas planter avec des éléments invalides', () => {
      expect(() => safeClassRemove(null, 'test')).not.toThrow();
      expect(() => safeClassRemove(undefined, 'test')).not.toThrow();
    });
  });

  describe('safeClassToggle', () => {
    let mockElement: any;

    beforeEach(() => {
      mockElement = {
        classList: {
          toggle: vi.fn().mockReturnValue(true),
        }
      };
    });

    it('devrait toggler une classe sur un élément valide', () => {
      const result = safeClassToggle(mockElement, 'test-class');
      expect(mockElement.classList.toggle).toHaveBeenCalledWith('test-class', undefined);
      expect(result).toBe(true);
    });

    it('devrait retourner false pour des éléments invalides', () => {
      const result1 = safeClassToggle(null, 'test');
      const result2 = safeClassToggle(undefined, 'test');
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('devrait gérer le paramètre force', () => {
      safeClassToggle(mockElement, 'test-class', true);
      expect(mockElement.classList.toggle).toHaveBeenCalledWith('test-class', true);
    });
  });

  describe('must', () => {
    it('devrait retourner la valeur si elle existe', () => {
      expect(must('test')).toBe('test');
      expect(must(123)).toBe(123);
      expect(must([])).toEqual([]);
    });

    it('devrait lancer une erreur en dev si la valeur est null', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      expect(() => must(null)).toThrow('Required value is missing');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('devrait retourner un objet vide en production si la valeur est null', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const result = must(null);
      expect(result).toEqual({});
      
      process.env.NODE_ENV = originalEnv;
    });

    it('devrait utiliser un message personnalisé', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      expect(() => must(undefined, 'Custom error')).toThrow('[must] Custom error');
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('ensureMap', () => {
    it('devrait retourner une Map vide si undefined', () => {
      const result = ensureMap(undefined);
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });

    it('devrait retourner la Map existante si valide', () => {
      const originalMap = new Map([['key', 'value']]);
      const result = ensureMap(originalMap);
      expect(result).toBe(originalMap);
    });
  });

  describe('safeMapSet', () => {
    it('devrait créer une nouvelle Map et ajouter l\'élément si undefined', () => {
      const result = safeMapSet(undefined, 'key', 'value');
      expect(result).toBeInstanceOf(Map);
      expect(result.get('key')).toBe('value');
    });
  });

  describe('ensureArray', () => {
    it('devrait retourner un Array vide si undefined', () => {
      const result = ensureArray(undefined);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('devrait retourner l\'Array existant si valide', () => {
      const originalArray = ['a', 'b'];
      const result = ensureArray(originalArray);
      expect(result).toBe(originalArray);
    });
  });

  describe('safePush', () => {
    it('devrait créer un nouveau Array et ajouter des éléments si undefined', () => {
      const result = safePush(undefined, 'item1', 'item2');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(['item1', 'item2']);
    });
  });

  describe('safeGetElement', () => {
    it('devrait retourner null pour un sélecteur invalide', () => {
      const result = safeGetElement('invalid[[[selector');
      expect(result).toBeNull();
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('safeDOM', () => {
    it('devrait exécuter l\'opération si elle réussit', () => {
      const result = safeDOM(() => 'success');
      expect(result).toBe('success');
    });

    it('devrait retourner le fallback si l\'opération échoue', () => {
      const result = safeDOM(
        () => { throw new Error('test'); },
        'fallback'
      );
      expect(result).toBe('fallback');
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('hasAddMethod', () => {
    it('devrait détecter si un objet a une méthode add', () => {
      expect(hasAddMethod(new Set())).toBe(true);
      expect(hasAddMethod({ add: () => {} })).toBe(true);
      expect(hasAddMethod({})).toBe(false);
      expect(hasAddMethod(null)).toBe(false);
    });
  });

  describe('safeAddToCollection', () => {
    it('devrait ajouter à une collection avec méthode add', () => {
      const set = new Set();
      const result = safeAddToCollection(set, 'item');
      expect(result).toBe(true);
      expect(set.has('item')).toBe(true);
    });

    it('devrait retourner false pour un objet sans méthode add', () => {
      const result = safeAddToCollection({}, 'item');
      expect(result).toBe(false);
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de la méthode add', () => {
      const mockCollection = {
        add: vi.fn().mockImplementation(() => {
          throw new Error('add failed');
        })
      };
      
      const result = safeAddToCollection(mockCollection, 'item');
      expect(result).toBe(false);
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('Intégration - Scénarios réels', () => {
    it('devrait gérer un scénario complet de mood mixer sans erreur', () => {
      // Simulation d'un scénario réel où des Sets peuvent être undefined
      let playingSounds: Set<string> | undefined;
      let selectedMoods: Set<string> | undefined;
      
      // Utilisation sécurisée
      playingSounds = safeAdd(playingSounds, 'sound1');
      playingSounds = safeAdd(playingSounds, 'sound2');
      
      selectedMoods = safeAdd(selectedMoods, 'calm');
      selectedMoods = safeAdd(selectedMoods, 'energetic');
      
      expect(playingSounds.has('sound1')).toBe(true);
      expect(playingSounds.has('sound2')).toBe(true);
      expect(selectedMoods.has('calm')).toBe(true);
      expect(selectedMoods.has('energetic')).toBe(true);
    });

    it('devrait gérer un scénario DOM complet sans erreur', () => {
      // Simulation d'éléments DOM qui peuvent être null
      const element1 = null;
      const element2 = { classList: { add: vi.fn(), remove: vi.fn() } };
      
      // Toutes ces opérations doivent passer sans erreur
      expect(() => {
        safeClassAdd(element1, 'class1');
        safeClassAdd(element2 as any, 'class2');
        safeClassRemove(element1, 'class1');
        safeClassToggle(element1, 'class1');
      }).not.toThrow();
      
      expect(element2.classList.add).toHaveBeenCalledWith('class2');
    });
  });
});