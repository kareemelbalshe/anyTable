import { ApiFetcherParams } from "../../types/api.types";

// ============================================================================
// 1. SAAS SUBSCRIPTIONS & FINANCIAL TRANSACTIONS
// ============================================================================
export interface SaaSSubscription {
  id: string;
  company: string;
  domain: string;
  logo: string;
  plan: "Enterprise" | "Pro" | "Growth" | "Starter";
  mrr: number; // in USD
  billingCycle: "Monthly" | "Annual";
  seats: number;
  paymentGateway: "Stripe" | "Paymob" | "PayPal" | "Fawry Pay";
  status: "Active" | "Past Due" | "Trialing" | "Cancelled";
  autoRenew: boolean;
  nextInvoiceDate: string;
  createdDate: string;
}

const makeSvgLogo = (text: string, color1: string, color2: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40'%3E%3Cdefs%3E%3ClinearGradient id='g_${text}' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='${encodeURIComponent(color1)}'/%3E%3Cstop offset='100%25' stop-color='${encodeURIComponent(color2)}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='40' height='40' rx='10' fill='url(%23g_${text})'/%3E%3Ctext x='20' y='25' font-family='system-ui,-apple-system,sans-serif' font-size='14' font-weight='800' fill='white' text-anchor='middle'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;

export const SAAS_SUBSCRIPTIONS_DB: SaaSSubscription[] = [
  {
    id: "sub_01",
    company: "Acme Cloud Technologies",
    domain: "acme.cloud",
    logo: makeSvgLogo("AC", "#3b82f6", "#1d4ed8"),
    plan: "Enterprise",
    mrr: 4850,
    billingCycle: "Annual",
    seats: 120,
    paymentGateway: "Stripe",
    status: "Active",
    autoRenew: true,
    nextInvoiceDate: "2026-11-15",
    createdDate: "2024-03-10",
  },
  {
    id: "sub_02",
    company: "NileFintech Global",
    domain: "nilefintech.eg",
    logo: makeSvgLogo("NF", "#10b981", "#059669"),
    plan: "Enterprise",
    mrr: 7200,
    billingCycle: "Annual",
    seats: 250,
    paymentGateway: "Paymob",
    status: "Active",
    autoRenew: true,
    nextInvoiceDate: "2026-12-01",
    createdDate: "2023-11-01",
  },
  {
    id: "sub_03",
    company: "HyperScale Analytics",
    domain: "hyperscale.io",
    logo: makeSvgLogo("HS", "#8b5cf6", "#6d28d9"),
    plan: "Pro",
    mrr: 1290,
    billingCycle: "Monthly",
    seats: 35,
    paymentGateway: "Stripe",
    status: "Active",
    autoRenew: true,
    nextInvoiceDate: "2026-09-28",
    createdDate: "2025-01-15",
  },
  {
    id: "sub_04",
    company: "Cairo AI Labs",
    domain: "cairoailabs.com",
    logo: makeSvgLogo("CA", "#f59e0b", "#d97706"),
    plan: "Pro",
    mrr: 1450,
    billingCycle: "Monthly",
    seats: 40,
    paymentGateway: "Fawry Pay",
    status: "Past Due",
    autoRenew: true,
    nextInvoiceDate: "2026-09-02",
    createdDate: "2025-02-18",
  },
  {
    id: "sub_05",
    company: "DevStream Studio",
    domain: "devstream.dev",
    logo: makeSvgLogo("DS", "#ec4899", "#be185d"),
    plan: "Growth",
    mrr: 680,
    billingCycle: "Monthly",
    seats: 18,
    paymentGateway: "PayPal",
    status: "Active",
    autoRenew: true,
    nextInvoiceDate: "2026-10-05",
    createdDate: "2025-04-12",
  },
  {
    id: "sub_06",
    company: "Oasis Logistics Cloud",
    domain: "oasislog.com",
    logo: makeSvgLogo("OL", "#06b6d4", "#0891b2"),
    plan: "Enterprise",
    mrr: 5600,
    billingCycle: "Annual",
    seats: 180,
    paymentGateway: "Paymob",
    status: "Active",
    autoRenew: true,
    nextInvoiceDate: "2026-10-30",
    createdDate: "2024-05-19",
  },
  {
    id: "sub_07",
    company: "PixelForge Media",
    domain: "pixelforge.design",
    logo: makeSvgLogo("PF", "#f43f5e", "#e11d48"),
    plan: "Starter",
    mrr: 290,
    billingCycle: "Monthly",
    seats: 6,
    paymentGateway: "Stripe",
    status: "Trialing",
    autoRenew: false,
    nextInvoiceDate: "2026-09-19",
    createdDate: "2026-09-05",
  },
  {
    id: "sub_08",
    company: "Quantum Commerce",
    domain: "quantum-shop.co",
    logo: makeSvgLogo("QC", "#6366f1", "#4f46e5"),
    plan: "Growth",
    mrr: 790,
    billingCycle: "Monthly",
    seats: 22,
    paymentGateway: "Stripe",
    status: "Cancelled",
    autoRenew: false,
    nextInvoiceDate: "2026-08-30",
    createdDate: "2024-08-11",
  },
  {
    id: "sub_09",
    company: "Scribe Flow Systems",
    domain: "scribeflow.app",
    logo: makeSvgLogo("SF", "#14b8a6", "#0d9488"),
    plan: "Starter",
    mrr: 190,
    billingCycle: "Annual",
    seats: 5,
    paymentGateway: "PayPal",
    status: "Active",
    autoRenew: true,
    nextInvoiceDate: "2027-02-14",
    createdDate: "2026-02-14",
  },
  {
    id: "sub_10",
    company: "Vertex Security Grid",
    domain: "vertexsec.net",
    logo: makeSvgLogo("VS", "#64748b", "#334155"),
    plan: "Enterprise",
    mrr: 9400,
    billingCycle: "Annual",
    seats: 320,
    paymentGateway: "Stripe",
    status: "Active",
    autoRenew: true,
    nextInvoiceDate: "2027-01-10",
    createdDate: "2023-09-12",
  },
];

export async function fetchSaaSSubscriptionsApi(
  params: ApiFetcherParams
): Promise<{ data: SaaSSubscription[]; total: number; page: number; pageSize: number }> {
  await new Promise((r) => setTimeout(r, 280));
  let list = [...SAAS_SUBSCRIPTIONS_DB];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (s) =>
        s.company.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        s.plan.toLowerCase().includes(q) ||
        s.paymentGateway.toLowerCase().includes(q)
    );
  }

  if (params.sortBy) {
    const key = params.sortBy as keyof SaaSSubscription;
    list.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (valA < valB) return params.sortOrder === "desc" ? 1 : -1;
      if (valA > valB) return params.sortOrder === "desc" ? -1 : 1;
      return 0;
    });
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 5;
  const total = list.length;
  const data = list.slice((page - 1) * pageSize, page * pageSize);

  return { data, total, page, pageSize };
}
