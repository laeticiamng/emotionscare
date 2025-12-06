// @ts-nocheck
import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import { isValidElementType } from 'react-is';

type LazyModule<T> = {
  default?: T;
} & Record<string, unknown>;

const isComponent = <T>(value: unknown): value is T => {
  return isValidElementType(value);
};

export function lazyDefault<T extends ComponentType<any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
  importer: () => Promise<LazyModule<T>>,
  exportName?: keyof LazyModule<T> | string
): LazyExoticComponent<T> {
  return lazy(async () => {
    const module = await importer();

    const candidate =
      module.default ??
      (exportName ? (module as Record<string, unknown>)[exportName as string] : undefined) ??
      Object.values(module).find((value) => isComponent<T>(value));

    if (!candidate) {
      throw new Error(
        exportName
          ? `lazyDefault: Aucun export trouvé pour "${String(exportName)}" et aucun export par défaut disponible.`
          : 'lazyDefault: Aucun composant React exporté détecté.'
      );
    }

    return { default: candidate as T };
  });
}

export type { LazyModule };
