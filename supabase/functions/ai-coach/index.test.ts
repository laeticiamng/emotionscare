import { assertEquals, assertMatch } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { __testables } from "./index.ts";

Deno.test('detectGuardrail identifies crisis patterns', () => {
  assertEquals(__testables.detectGuardrail('je pense au suicide'), 'self_harm');
  assertEquals(__testables.detectGuardrail('il y a une agression en cours'), 'crisis');
  assertEquals(__testables.detectGuardrail('quel dosage pour ce médicament ?'), 'medical');
  assertEquals(__testables.detectGuardrail('tout va bien'), null);
});

Deno.test('splitText splits long content safely', () => {
  const chunks = __testables.splitText('Bonjour. Ceci est un message assez long pour tester la découpe. Merci.');
  assertEquals(chunks.length > 1, true);
  chunks.forEach(part => assertEquals(part.length > 0, true));
});

Deno.test('redactSensitive masks PII', () => {
  const redacted = __testables.redactSensitive('Contacte-moi au 06 12 34 56 78 ou test@example.com');
  assertMatch(redacted, /\[tel]/);
  assertMatch(redacted, /\[email]/);
});

Deno.test('buildThreadId uses hash prefix when available', () => {
  const id = __testables.buildThreadId({ message: 'hello', mode: 'b2c', locale: 'fr', user_hash: 'a'.repeat(64) });
  assertMatch(id, /^aaaaaaaaaaaa-/);
});
