import { z } from "zod";

export const Instrument = z.enum([
  "WHO5","STAI6","PANAS10","PSS10","UCLA3","MSPSS","AAQ2","POMS_SF","SSQ",
  "ISI","GAS","GRITS","BRS","WEMWBS","SWEMWBS","UWES9","CBI","CVSQ","SAM","SUDS"
]);

export const Context = z.enum(["pre","post","weekly","monthly","adhoc"]);

export const StartInput = z.object({
  instrument: Instrument,
  lang: z.string().default("fr"),
  context: Context.optional()
});

export const StartOutput = z.object({
  session_id: z.string().uuid(),
  items: z.array(z.object({
    id: z.string(),
    prompt: z.string(),
    choices: z.array(z.union([z.string(), z.number()])).optional()
  })),
  expiry_ts: z.number()
});

export const SubmitInput = z.object({
  session_id: z.string().uuid(),
  answers: z.array(z.object({ id: z.string(), value: z.number() })),
  meta: z.object({
    duration_ms: z.number().int().nonnegative().optional(),
    device_flags: z.record(z.string(), z.any()).optional()
  }).optional()
});

export const SubmitOutput = z.object({
  receipt_id: z.string().uuid(),
  orchestration: z.object({
    hints: z.array(z.string())
  })
});

export const AggregateInput = z.object({
  org_id: z.string().uuid(),
  period: z.object({ from: z.string(), to: z.string() }),
  instruments: z.array(Instrument).optional(),
  team_id: z.string().uuid().optional(),
  min_n: z.number().int().min(5).default(5)
});

export const AggregateOutput = z.object({
  ok: z.literal(true),
  n: z.number().int(),
  text_summary: z.array(z.string())
});
