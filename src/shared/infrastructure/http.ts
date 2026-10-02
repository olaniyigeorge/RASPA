import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DomainError } from "../kernel/errors";

type Handler<A extends unknown[]> = (...args: A) => Promise<Response>;

/** Wraps a route handler so domain/validation errors become JSON responses. */
export function route<A extends unknown[]>(handler: Handler<A>): Handler<A> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof DomainError) {
        return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
      }
      if (err instanceof ZodError) {
        return NextResponse.json({ error: err.flatten() }, { status: 400 });
      }
      console.error(err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
