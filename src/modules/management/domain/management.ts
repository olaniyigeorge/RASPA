import { DomainError } from "../../../shared/kernel/errors";

export type SubscriptionStatus = "PENDING" | "ACTIVE" | "PAST_DUE" | "CANCELLED";
export type TicketCategory = "DISPUTE" | "BILL" | "WASTE" | "UTILITY" | "MAINTENANCE" | "OTHER";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface Subscription {
  id: string;
  propertyId: string;
  subscriberId: string;
  planId: string;
  status: SubscriptionStatus;
  paystackSubscriptionCode: string | null;
  currentPeriodEnd: Date | null;
}

export interface Ticket {
  id: string;
  propertyId: string;
  status: TicketStatus;
}

/** The management dashboard is a paid feature: only an active subscription can use it. */
export const isEntitled = (s: Pick<Subscription, "status" | "currentPeriodEnd"> | null, now = new Date()) =>
  !!s && s.status === "ACTIVE" && (!s.currentPeriodEnd || s.currentPeriodEnd > now);

export function assertEntitled(s: Pick<Subscription, "status" | "currentPeriodEnd"> | null) {
  if (!isEntitled(s)) {
    throw new DomainError("Subscribe to a management plan to use the property dashboard", "SUBSCRIPTION_REQUIRED", 402);
  }
}

export function activate(s: Subscription, periodEnd: Date | null): Subscription {
  if (s.status === "CANCELLED") throw new DomainError("Subscription is cancelled", "SUBSCRIPTION_CANCELLED");
  return { ...s, status: "ACTIVE", currentPeriodEnd: periodEnd ?? s.currentPeriodEnd };
}

export const nextTicketStatus: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "RESOLVED"],
  IN_PROGRESS: ["RESOLVED", "OPEN"],
  RESOLVED: ["OPEN"],
};

export function moveTicket(t: Ticket, to: TicketStatus): Ticket {
  if (!nextTicketStatus[t.status].includes(to)) {
    throw new DomainError(`Ticket cannot move from ${t.status} to ${to}`, "INVALID_TICKET_TRANSITION");
  }
  return { ...t, status: to };
}

/** Approximate length of one billing period, used until Paystack reports the real next date. */
export function periodEndFor(interval: "MONTHLY" | "QUARTERLY" | "ANNUALLY", from = new Date()): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() + (interval === "MONTHLY" ? 1 : interval === "QUARTERLY" ? 3 : 12));
  return d;
}

// ---- persistence port ------------------------------------------------------

export type PlanInterval = "MONTHLY" | "QUARTERLY" | "ANNUALLY";

/** A management plan; `amount` is in naira (see shared/kernel/money). */
export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  amount: number;
  interval: PlanInterval;
  paystackPlanCode: string | null;
  features: string[];
  active: boolean;
}

export interface TicketRecord extends Ticket {
  raisedById: string;
  assigneeId: string | null;
  category: TicketCategory;
  title: string;
  description: string | null;
  amountDue: number | null;
  dueDate: Date | null;
  resolvedAt: Date | null;
  createdAt: Date;
}

export interface NewTicket {
  propertyId: string;
  raisedById: string;
  category: TicketCategory;
  title: string;
  description?: string;
  amountDue?: number;
  dueDate?: Date;
}

export interface ManagementRepository {
  listActivePlans(): Promise<Plan[]>;
  findPlanByCode(code: string): Promise<Plan | null>;

  /** Latest ACTIVE or PAST_DUE subscription of a property. */
  findActiveSubscription(propertyId: string): Promise<Subscription | null>;
  createSubscription(i: { propertyId: string; subscriberId: string; planId: string }): Promise<Subscription>;
  findSubscriptionWithPlan(id: string): Promise<(Subscription & { plan: Plan }) | null>;
  updateSubscription(id: string, data: Partial<Pick<Subscription, "status" | "currentPeriodEnd">>): Promise<void>;
  /** Latest subscription of this customer on this Paystack plan not yet linked to a Paystack subscription. */
  findPendingSubscription(customerEmail: string | undefined, paystackPlanCode: string | undefined): Promise<Subscription | null>;
  linkPaystackSubscription(id: string, subscriptionCode: string, currentPeriodEnd: Date | null | undefined): Promise<void>;
  updateSubscriptionsByPaystackCode(
    subscriptionCode: string,
    data: Partial<Pick<Subscription, "status" | "currentPeriodEnd">>
  ): Promise<void>;

  listTickets(propertyId: string): Promise<TicketRecord[]>;
  createTicket(i: NewTicket): Promise<TicketRecord>;
  findTicket(id: string): Promise<TicketRecord | null>;
  updateTicket(id: string, data: { status: TicketStatus; resolvedAt: Date | null }): Promise<void>;

  /** Lister, owner or active tenant of the property. */
  canManage(propertyId: string, userId: string): Promise<boolean>;
}
