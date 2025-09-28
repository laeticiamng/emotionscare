import flags from "./flags.json" assert { type: "json" };

export function ff(name: keyof typeof flags): boolean {
  return Boolean((flags as Record<string, boolean>)[name]);
}
