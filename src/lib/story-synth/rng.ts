// @ts-nocheck
// RNG déterministe (mulberry32 + hash simple)
export function hashSeed(s: string) {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0) || 1;
}
export function createRng(seedStr: string) {
  let t = hashSeed(seedStr);
  return function rand() {
    // mulberry32
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
export function pick<T>(rand: () => number, arr: T[]) {
  return arr[Math.floor(rand() * arr.length)];
}
