import { context, trace, SpanStatusCode, type Span } from 'https://esm.sh/@opentelemetry/api@1.9.0';
import { BasicTracerProvider, BatchSpanProcessor } from 'https://esm.sh/@opentelemetry/sdk-trace-base@1.9.0';
import { OTLPTraceExporter } from 'https://esm.sh/@opentelemetry/exporter-trace-otlp-http@0.50.0';

const globalState = globalThis as typeof globalThis & {
  __ecOtelProvider?: BasicTracerProvider;
  __ecOtelInitialized?: boolean;
};

const getEnv = (key: string): string | undefined => {
  try {
    if (typeof Deno !== 'undefined' && typeof Deno.env?.get === 'function') {
      return Deno.env.get(key) ?? undefined;
    }
  } catch {
    // ignore – running in non-Deno environment (tests)
  }
  return undefined;
};

function parseHeaders(raw: string | undefined): Record<string, string> {
  if (!raw) {
    return {};
  }

  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, item) => {
      const [key, ...rest] = item.split('=');
      if (!key || rest.length === 0) {
        return acc;
      }
      acc[key.trim().toLowerCase()] = rest.join('=').trim();
      return acc;
    }, {});
}

function ensureProvider(): BasicTracerProvider {
  if (globalState.__ecOtelProvider) {
    return globalState.__ecOtelProvider;
  }

  const provider = new BasicTracerProvider();
  const endpoint = getEnv('OTEL_EXPORTER_OTLP_ENDPOINT');
  const headers = parseHeaders(getEnv('OTEL_EXPORTER_OTLP_HEADERS'));

  if (endpoint) {
    const exporter = new OTLPTraceExporter({
      url: endpoint,
      headers,
    });
    provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  }

  provider.register();
  globalState.__ecOtelProvider = provider;
  globalState.__ecOtelInitialized = true;
  return provider;
}

ensureProvider();

export const tracer = trace.getTracer('ec-edge');

export async function traced<T>(
  name: string,
  fn: (span: Span) => Promise<T> | T,
  attributes?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  ensureProvider();

  const span = tracer.startSpan(name);

  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      if (value === undefined) {
        continue;
      }
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        span.setAttribute(key, value);
      }
    }
  }

  try {
    return await context.with(trace.setSpan(context.active(), span), async () => {
      return await fn(span);
    });
  } catch (error) {
    if (error instanceof Error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    } else {
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'edge_function_error' });
    }
    throw error;
  } finally {
    span.end();
  }
}
