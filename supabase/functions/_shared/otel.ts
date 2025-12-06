// @ts-nocheck
let tracerSetup: Promise<{
  tracer: import('https://esm.sh/@opentelemetry/api@1.10.0').Tracer;
  contextApi: typeof import('https://esm.sh/@opentelemetry/api@1.10.0').context;
  traceApi: typeof import('https://esm.sh/@opentelemetry/api@1.10.0').trace;
  SpanStatusCode: typeof import('https://esm.sh/@opentelemetry/api@1.10.0').SpanStatusCode;
}> | null = null;

const parseHeaders = (raw: string | undefined): Record<string, string> => {
  if (!raw) {
    return {};
  }

  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .reduce<Record<string, string>>((acc, entry) => {
      const separatorIndex = entry.indexOf('=');
      if (separatorIndex <= 0) {
        return acc;
      }
      const key = entry.slice(0, separatorIndex).trim();
      const value = entry.slice(separatorIndex + 1).trim();
      if (!key || !value) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
};

const ensureTracer = async () => {
  if (tracerSetup) {
    return tracerSetup;
  }

  if (typeof Deno === 'undefined') {
    tracerSetup = Promise.resolve(null);
    return tracerSetup;
  }

  const endpoint = Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT');
  if (!endpoint) {
    tracerSetup = Promise.resolve(null);
    return tracerSetup;
  }

  tracerSetup = (async () => {
    try {
      const [api, sdk, exporterModule] = await Promise.all([
        import('https://esm.sh/@opentelemetry/api@1.10.0'),
        import('https://esm.sh/@opentelemetry/sdk-trace-base@1.10.0'),
        import('https://esm.sh/@opentelemetry/exporter-trace-otlp-http@0.50.0'),
      ]);

      const headers = parseHeaders(Deno.env.get('OTEL_EXPORTER_OTLP_HEADERS') ?? '');
      const exporter = new exporterModule.OTLPTraceExporter({
        url: endpoint,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
      });

      const provider = new sdk.BasicTracerProvider();
      provider.addSpanProcessor(new sdk.BatchSpanProcessor(exporter));
      provider.register();

      return {
        tracer: api.trace.getTracer('ec-edge'),
        contextApi: api.context,
        traceApi: api.trace,
        SpanStatusCode: api.SpanStatusCode,
      };
    } catch (error) {
      console.warn('[observability] unable to initialise OpenTelemetry', error);
      return null;
    }
  })();

  return tracerSetup;
};

type TraceOptions = {
  attributes?: Record<string, string | number | boolean>;
};

export async function traced<T>(name: string, fn: () => Promise<T>, options: TraceOptions = {}): Promise<T> {
  const setup = await ensureTracer();
  if (!setup) {
    return fn();
  }

  const { tracer, contextApi, traceApi, SpanStatusCode } = setup;
  const span = tracer.startSpan(name);

  if (options.attributes) {
    for (const [key, value] of Object.entries(options.attributes)) {
      span.setAttribute(key, value as never);
    }
  }

  try {
    return await contextApi.with(traceApi.setSpan(contextApi.active(), span), fn);
  } catch (error) {
    span.recordException(error as Error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : String(error ?? 'error'),
    });
    throw error;
  } finally {
    span.end();
  }
}
