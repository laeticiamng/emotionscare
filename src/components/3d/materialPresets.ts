/**
 * Centralized premium material presets for all 3D scenes.
 * Ensures visual coherence across orbs, cores, rings, halos.
 *
 * Usage: import preset objects and spread onto JSX material props,
 * or use the helper functions for dynamic color application.
 */

/**
 * Premium translucent outer shell — used for breathing orbs, galaxy core, nebula sphere.
 * MeshPhysicalMaterial properties for a glassy, organic appearance.
 */
export const OUTER_SHELL_PRESET = {
  transparent: true,
  opacity: 0.3,
  roughness: 0.08,
  metalness: 0.05,
  transmission: 0.55,
  thickness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  ior: 1.4,
  emissiveIntensity: 0.4,
} as const;

/**
 * Inner glow core — bright emissive center of orbs/spheres.
 * MeshStandardMaterial properties.
 */
export const INNER_CORE_PRESET = {
  transparent: true,
  opacity: 0.75,
  roughness: 0,
  metalness: 0,
  emissiveIntensity: 1.2,
} as const;

/**
 * Ripple/orbital ring — subtle torus rings around orbs.
 * MeshStandardMaterial properties.
 */
export const RING_PRESET = {
  transparent: true,
  opacity: 0.18,
  emissiveIntensity: 0.5,
} as const;

/**
 * Atmospheric halo — large additive-blend glow sphere.
 * MeshBasicMaterial with AdditiveBlending.
 */
export const HALO_PRESET = {
  transparent: true,
  opacity: 0.04,
  depthWrite: false,
} as const;

/**
 * Galaxy core outer shell — slightly different from breathing orb
 * for a warmer, denser core appearance.
 */
export const GALAXY_CORE_PRESET = {
  transparent: true,
  opacity: 0.35,
  roughness: 0.12,
  transmission: 0.3,
  thickness: 0.3,
  clearcoat: 0.8,
  clearcoatRoughness: 0.12,
  emissiveIntensity: 1.5,
} as const;
