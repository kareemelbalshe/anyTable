import { ApiFetcherParams } from "../types/api.types";

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

// ============================================================================
// 2. HR & EMPLOYEE MANAGEMENT DIRECTORY
// ============================================================================
export interface HREmployee {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  department: "Engineering" | "Product" | "Design" | "Marketing" | "Operations" | "Sales";
  role: string;
  salary: number; // in EGP
  performanceRating: number; // out of 5
  status: "Active" | "On Leave" | "Remote" | "Probation";
  hireDate: string;
  skills: string[];
}

export const HR_EMPLOYEES_DB: HREmployee[] = [
  {
    id: "emp_101",
    name: "Omar Farouk",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    email: "omar.farouk@techcorp.eg",
    phone: "+20 100 234 5678",
    department: "Engineering",
    role: "Lead Fullstack Architect",
    salary: 85000,
    performanceRating: 4.9,
    status: "Active",
    hireDate: "2022-03-01",
    skills: ["React", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    id: "emp_102",
    name: "Nouran El-Shamy",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    email: "nouran.shamy@techcorp.eg",
    phone: "+20 111 876 5432",
    department: "Product",
    role: "Principal Product Manager",
    salary: 78000,
    performanceRating: 4.8,
    status: "Active",
    hireDate: "2022-07-15",
    skills: ["Roadmapping", "Agile", "User Research", "Data Analytics"],
  },
  {
    id: "emp_103",
    name: "Youssef Mansour",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    email: "youssef.mansour@techcorp.eg",
    phone: "+20 122 345 6789",
    department: "Design",
    role: "Senior Product Designer (UI/UX)",
    salary: 58000,
    performanceRating: 4.7,
    status: "Remote",
    hireDate: "2023-02-10",
    skills: ["Figma", "Design Systems", "Prototyping", "Micro-interactions"],
  },
  {
    id: "emp_104",
    name: "Hala Mahmoud",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    email: "hala.mahmoud@techcorp.eg",
    phone: "+20 102 987 6543",
    department: "Marketing",
    role: "Growth & Performance Lead",
    salary: 52000,
    performanceRating: 4.6,
    status: "Active",
    hireDate: "2023-08-20",
    skills: ["SEO", "Google Ads", "Conversion Rate", "Content Strategy"],
  },
  {
    id: "emp_105",
    name: "Tarek Khalil",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    email: "tarek.khalil@techcorp.eg",
    phone: "+20 155 432 1098",
    department: "Engineering",
    role: "DevOps & Cloud Engineer",
    salary: 68000,
    performanceRating: 4.9,
    status: "Active",
    hireDate: "2022-11-05",
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
  },
  {
    id: "emp_106",
    name: "Salma Abdelrahman",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    email: "salma.abdel@techcorp.eg",
    phone: "+20 114 567 8901",
    department: "Operations",
    role: "People & Culture Operations",
    salary: 44000,
    performanceRating: 4.4,
    status: "On Leave",
    hireDate: "2024-01-08",
    skills: ["HRIS", "Talent Acquisition", "Policy Management"],
  },
  {
    id: "emp_107",
    name: "Karim Hegazi",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    email: "karim.hegazi@techcorp.eg",
    phone: "+20 109 654 3210",
    department: "Sales",
    role: "Enterprise Solutions Executive",
    salary: 62000,
    performanceRating: 4.8,
    status: "Active",
    hireDate: "2023-05-18",
    skills: ["B2B SaaS Sales", "Negotiation", "CRM", "Client Retention"],
  },
  {
    id: "emp_108",
    name: "Dina Samir",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    email: "dina.samir@techcorp.eg",
    phone: "+20 120 123 9876",
    department: "Engineering",
    role: "Junior Frontend Engineer",
    salary: 32000,
    performanceRating: 4.3,
    status: "Probation",
    hireDate: "2026-06-01",
    skills: ["TypeScript", "React", "Tailwind CSS", "Git"],
  },
];

export async function fetchHREmployeesApi(
  params: ApiFetcherParams
): Promise<{ data: HREmployee[]; total: number; page: number; pageSize: number }> {
  await new Promise((r) => setTimeout(r, 260));
  let list = [...HR_EMPLOYEES_DB];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q)
    );
  }

  if (params.sortBy) {
    const key = params.sortBy as keyof HREmployee;
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

// ============================================================================
// 3. DEVOPS & CLOUD INFRASTRUCTURE TELEMETRY
// ============================================================================
export interface CloudServerNode {
  id: string;
  hostname: string;
  region: string;
  ip: string;
  cpuUsage: number; // 0 - 100
  memoryUsage: number; // 0 - 100
  latency: number; // in ms
  uptime: string;
  status: "Healthy" | "Warning" | "Critical" | "Maintenance";
  isProtected: boolean;
  lastRestart: string;
}

export const CLOUD_SERVERS_DB: CloudServerNode[] = [
  {
    id: "srv_01",
    hostname: "cairo-api-prod-01",
    region: "🇪🇬 Cairo (me-north-1)",
    ip: "156.198.42.11",
    cpuUsage: 34,
    memoryUsage: 58,
    latency: 18,
    uptime: "99.99%",
    status: "Healthy",
    isProtected: true,
    lastRestart: "48 days ago",
  },
  {
    id: "srv_02",
    hostname: "cairo-db-cluster-primary",
    region: "🇪🇬 Cairo (me-north-1)",
    ip: "156.198.42.15",
    cpuUsage: 88,
    memoryUsage: 82,
    latency: 22,
    uptime: "99.95%",
    status: "Warning",
    isProtected: true,
    lastRestart: "120 days ago",
  },
  {
    id: "srv_03",
    hostname: "frankfurt-edge-proxy-01",
    region: "🇩🇪 Frankfurt (eu-central-1)",
    ip: "18.192.88.94",
    cpuUsage: 21,
    memoryUsage: 42,
    latency: 45,
    uptime: "100.0%",
    status: "Healthy",
    isProtected: true,
    lastRestart: "14 days ago",
  },
  {
    id: "srv_04",
    hostname: "virginia-ai-inference-gpu",
    region: "🇺🇸 Virginia (us-east-1)",
    ip: "54.210.120.73",
    cpuUsage: 96,
    memoryUsage: 94,
    latency: 130,
    uptime: "98.80%",
    status: "Critical",
    isProtected: false,
    lastRestart: "2 hours ago",
  },
  {
    id: "srv_05",
    hostname: "dubai-redis-cache-01",
    region: "🇦🇪 Dubai (me-central-1)",
    ip: "3.28.140.50",
    cpuUsage: 14,
    memoryUsage: 35,
    latency: 29,
    uptime: "99.99%",
    status: "Healthy",
    isProtected: true,
    lastRestart: "92 days ago",
  },
  {
    id: "srv_06",
    hostname: "london-worker-queue-03",
    region: "🇬🇧 London (eu-west-2)",
    ip: "35.178.60.22",
    cpuUsage: 0,
    memoryUsage: 12,
    latency: 0,
    uptime: "99.10%",
    status: "Maintenance",
    isProtected: false,
    lastRestart: "Just now",
  },
];

export async function fetchCloudServersApi(
  params: ApiFetcherParams
): Promise<{ data: CloudServerNode[]; total: number; page: number; pageSize: number }> {
  await new Promise((r) => setTimeout(r, 220));
  let list = [...CLOUD_SERVERS_DB];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (s) =>
        s.hostname.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q) ||
        s.ip.includes(q) ||
        s.status.toLowerCase().includes(q)
    );
  }

  if (params.sortBy) {
    const key = params.sortBy as keyof CloudServerNode;
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

// ============================================================================
// 4. HEALTHCARE & CLINIC APPOINTMENTS
// ============================================================================
export interface MedicalAppointment {
  id: string;
  patientName: string;
  patientAge: number;
  doctor: string;
  specialty: "Cardiology" | "Neurology" | "Orthopedics" | "Dermatology" | "Pediatrics" | "Ophthalmology";
  appointmentDate: string;
  type: "In-Person" | "Telehealth" | "Emergency";
  triage: "Urgent" | "Normal" | "Critical";
  status: "Confirmed" | "Waiting" | "In Consultation" | "Completed" | "Cancelled";
  fee: number; // in EGP
  insuranceCovered: boolean;
}

export const MEDICAL_APPOINTMENTS_DB: MedicalAppointment[] = [
  {
    id: "apt_101",
    patientName: "Mahmoud Hassan",
    patientAge: 46,
    doctor: "Dr. Sherif Zaki",
    specialty: "Cardiology",
    appointmentDate: "2026-09-06 10:30",
    type: "In-Person",
    triage: "Critical",
    status: "Waiting",
    fee: 950,
    insuranceCovered: true,
  },
  {
    id: "apt_102",
    patientName: "Laila El-Gammal",
    patientAge: 29,
    doctor: "Dr. Mona Ragab",
    specialty: "Dermatology",
    appointmentDate: "2026-09-06 11:15",
    type: "In-Person",
    triage: "Normal",
    status: "Confirmed",
    fee: 650,
    insuranceCovered: false,
  },
  {
    id: "apt_103",
    patientName: "Ziad Taha",
    patientAge: 12,
    doctor: "Dr. Ahmed Mansi",
    specialty: "Pediatrics",
    appointmentDate: "2026-09-06 12:00",
    type: "Telehealth",
    triage: "Urgent",
    status: "In Consultation",
    fee: 500,
    insuranceCovered: true,
  },
  {
    id: "apt_104",
    patientName: "Fatma Rostom",
    patientAge: 62,
    doctor: "Dr. Hossam Allam",
    specialty: "Orthopedics",
    appointmentDate: "2026-09-06 13:00",
    type: "In-Person",
    triage: "Normal",
    status: "Confirmed",
    fee: 800,
    insuranceCovered: true,
  },
  {
    id: "apt_105",
    patientName: "Khaled Badran",
    patientAge: 38,
    doctor: "Dr. Yasmine Saeed",
    specialty: "Neurology",
    appointmentDate: "2026-09-06 14:30",
    type: "In-Person",
    triage: "Urgent",
    status: "Waiting",
    fee: 1100,
    insuranceCovered: true,
  },
  {
    id: "apt_106",
    patientName: "Menna Ezzat",
    patientAge: 24,
    doctor: "Dr. Tarek Helmy",
    specialty: "Ophthalmology",
    appointmentDate: "2026-09-06 15:45",
    type: "Telehealth",
    triage: "Normal",
    status: "Completed",
    fee: 600,
    insuranceCovered: false,
  },
];

export async function fetchMedicalAppointmentsApi(
  params: ApiFetcherParams
): Promise<{ data: MedicalAppointment[]; total: number; page: number; pageSize: number }> {
  await new Promise((r) => setTimeout(r, 240));
  let list = [...MEDICAL_APPOINTMENTS_DB];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (m) =>
        m.patientName.toLowerCase().includes(q) ||
        m.doctor.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q) ||
        m.status.toLowerCase().includes(q)
    );
  }

  if (params.sortBy) {
    const key = params.sortBy as keyof MedicalAppointment;
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
