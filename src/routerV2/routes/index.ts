// @ts-nocheck
/**
 * Index des routes - compose le componentMap global à partir des segments
 */
import type React from 'react';
import { publicComponentMap } from './publicRoutes';
import { b2cComponentMap } from './b2cRoutes';
import { b2bComponentMap } from './b2bRoutes';
import { adminComponentMap } from './adminRoutes';

export const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  ...publicComponentMap,
  ...b2cComponentMap,
  ...b2bComponentMap,
  ...adminComponentMap,
};

export { publicComponentMap, b2cComponentMap, b2bComponentMap, adminComponentMap };
