export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string = "DOMAIN_ERROR",
    public readonly status: number = 422
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends DomainError {
  constructor(what = "Resource") {
    super(`${what} not found`, "NOT_FOUND", 404);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Sign in required") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "You are not allowed to do that") {
    super(message, "FORBIDDEN", 403);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
  }
}

export class TooManyRequestsError extends DomainError {
  constructor(public readonly retryAfterSeconds?: number) {
    super("Too many requests. Please try again shortly.", "RATE_LIMITED", 429);
  }
}
