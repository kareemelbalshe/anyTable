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

export const SAAS_SUBSCRIPTIONS_DB: SaaSSubscription[] = [
  {
    id: "sub_01",
    company: "Acme Cloud Technologies",
    domain: "acme.cloud",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=100&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1633409381658-18e4d7729f2e?w=100&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=100&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=100&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80",
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
