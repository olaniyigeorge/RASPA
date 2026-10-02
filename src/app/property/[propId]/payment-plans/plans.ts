// Which payment plans each listing purpose offers.
export const PLAN_COPY = {
  BUY_NOW: { href: "buy-now", label: "Buy now", title: "Buy now", blurb: "Pay the full amount upfront and take ownership immediately." },
  INSTALLMENTS: { href: "installments", label: "Pay in installments", title: "Installments", blurb: "Spread payment across a fixed number of months." },
  INVEST: { href: "invest", label: "Invest", title: "Invest", blurb: "Put capital into this property and earn a projected return." },
  RENT: { href: "rent", label: "Rent this property", title: "Rent", blurb: "Pay the rent to take up this tenancy." },
} as const;

export const PROPERTY_PLANS: Record<string, (typeof PLAN_COPY)[keyof typeof PLAN_COPY][]> = {
  SALE: [PLAN_COPY.BUY_NOW, PLAN_COPY.INSTALLMENTS],
  INSTALLMENT: [PLAN_COPY.INSTALLMENTS, PLAN_COPY.BUY_NOW],
  INVEST: [PLAN_COPY.INVEST],
  RENT: [PLAN_COPY.RENT],
};
