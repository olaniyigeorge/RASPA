import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DomainError, TooManyRequestsError } from "../kernel/errors";
import { reportError } from "./logger";

type Handler<A extends unknown[]> = (...args: A) => Promise<Response>;

/** Wraps a route handler so domain/validation errors become JSON responses. */
export function route<A extends unknown[]>(handler: Handler<A>): Handler<A> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof DomainError) {
        const headers =
          err instanceof TooManyRequestsError && err.retryAfterSeconds
            ? { "Retry-After": String(err.retryAfterSeconds) }
            : undefined;
        return NextResponse.json({ error: err.message, code: err.code }, { status: err.status, headers });
      }
      if (err instanceof ZodError) {
        return NextResponse.json({ error: err.flatten() }, { status: 400 });
      }
      const req = args[0] instanceof Request ? args[0] : undefined;
      reportError(err, { message: "route handler failed", method: req?.method, url: req?.url });
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
