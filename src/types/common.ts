// @ts-nocheck
// Type fixes pour éviter les erreurs lucide-react et TypeScript
import { LucideProps, LucideIcon } from 'lucide-react';
import { ComponentType, ForwardRefExoticComponent, RefAttributes, createElement } from 'react';
import { logger } from '@/lib/logger';

// Type correct pour les icônes lucide-react
export type LucideIconType = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

// Type générique pour les composants
export type ComponentTypeGeneric<T = {}> = ComponentType<T>;

// Type pour les actions avec icônes
export interface ActionWithIcon {
  label: string;
  icon: LucideIconType;
  onClick: () => void;
  disabled?: boolean;
}

// Type pour les éléments de navigation
export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIconType;
  badge?: string;
  premium?: boolean;
}

// Type pour les éléments de menu
export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIconType;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// Type pour les templates
export interface Template {
  id: string;
  name: string;
  description: string;
  icon: LucideIconType;
  category: string;
  premium?: boolean;
}

// Type pour les features
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIconType;
  status: 'active' | 'inactive' | 'loading';
  premium?: boolean;
}

// Type pour les exercices
export interface Exercise {
  id: string;
  name: string;
  description: string;
  icon: LucideIconType;
  duration: number;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  category: string;
}

// Utilitaire pour vérifier si un composant est une icône lucide
export const isLucideIcon = (component: any): component is LucideIconType => {
  return component && typeof component === 'object' && '$$typeof' in component;
};

// Helper pour rendre une icône de manière sécurisée
export const renderIcon = (Icon: LucideIconType, props: Partial<LucideProps> = {}) => {
  if (!isLucideIcon(Icon)) {
    logger.warn('Invalid icon component passed to renderIcon', undefined, 'UI');
    return null;
  }
  const iconComponent = Icon as ComponentType<LucideProps>;
  return createElement(iconComponent, props as LucideProps);
};

export default {
  LucideIconType,
  ComponentTypeGeneric,
  ActionWithIcon,
  NavigationItem,
  MenuItem,
  Template,
  Feature,
  Exercise,
  isLucideIcon,
  renderIcon
};