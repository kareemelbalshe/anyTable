import { ApiFetcherParams } from "../../types/api.types";

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
