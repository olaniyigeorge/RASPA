/** Amounts are held in naira (number) in the domain and converted to kobo at the gateway edge. */
export const toKobo = (naira: number) => Math.round(naira * 100);
export const fromDecimal = (d: { toString(): string } | number | null | undefined) =>
  d === null || d === undefined ? 0 : Number(d.toString());
