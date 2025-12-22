import flags from "./flags.json";

type FlagName = keyof typeof flags;

export function ff(name: FlagName): boolean {
  return Boolean((flags as Record<string, boolean>)[name]);
}
