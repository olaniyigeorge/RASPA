/** Small fetch wrapper for client components; throws the server's error message. */
export async function api<T = unknown>(url: string, method: "POST" | "PATCH" | "DELETE" | "GET" = "POST", body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const e = json?.error;
    throw new Error(typeof e === "string" ? e : "Something went wrong. Please try again.");
  }
  return json as T;
}
