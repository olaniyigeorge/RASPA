/**
 * Leveled logger: JSON lines in production (for log drains), readable output in development.
 * LOG_LEVEL sets the minimum level (debug | info | warn | error; default info).
 */
type Level = "debug" | "info" | "warn" | "error";
type Context = Record<string, unknown>;

const order: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const threshold = () => order[(process.env.LOG_LEVEL as Level) ?? "info"] ?? order.info;

export function serializeError(err: unknown): Context {
  if (err instanceof Error) return { name: err.name, message: err.message, stack: err.stack };
  return { message: String(err) };
}

function write(level: Level, message: string, context?: Context) {
  if (order[level] < threshold()) return;
  const sink = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  if (process.env.NODE_ENV === "production") {
    sink(JSON.stringify({ level, time: new Date().toISOString(), message, ...context }));
  } else {
    sink(`[${level}] ${message}`, ...(context ? [context] : []));
  }
}

export const logger = {
  debug: (message: string, context?: Context) => write("debug", message, context),
  info: (message: string, context?: Context) => write("info", message, context),
  warn: (message: string, context?: Context) => write("warn", message, context),
  error: (message: string, context?: Context) => write("error", message, context),
};

/**
 * Report an unexpected error: always logged, and POSTed to ERROR_WEBHOOK_URL when set.
 * `context.message`, when given, becomes the log line's message; the error is nested under `error`.
 * Vendor-neutral on purpose; an error-tracking SDK (e.g. Sentry) can replace the body later.
 */
export function reportError(err: unknown, context?: Context) {
  const error = serializeError(err);
  const { message, ...rest } = context ?? {};
  logger.error(typeof message === "string" ? message : String(error.message), { ...rest, error });

  const url = process.env.ERROR_WEBHOOK_URL;
  if (!url) return;
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ time: new Date().toISOString(), error, context }),
  }).catch((e) => logger.warn("error report not delivered", { error: serializeError(e) }));
}
