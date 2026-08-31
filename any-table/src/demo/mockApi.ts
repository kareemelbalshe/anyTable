import { ApiFetcherParams } from "../types/api.types";

export interface MockUser {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  email: string;
  phone: string;
  avatar: string;
  role: "customer" | "driver" | "merchant" | "admin";
  isActive: boolean;
  isBanned: boolean;
  spend: number;
  ordersCount: number;
  status: "verified" | "pending" | "rejected";
  createdAt: string;
  address: {
    city: string;
    street: string;
  };
}

const FIRST_NAMES = ["Ahmed", "Mohamed", "Omar", "Sara", "Nour", "Kareem", "Youssef", "Layla", "Fatima", "Ali", "Hassan", "Zainab"];
const LAST_NAMES = ["El-Sayed", "Hassan", "Mansour", "Ibrahim", "Khalil", "Salem", "Fawzy", "Kamal", "Shalaby", "Zaki"];
const CITIES = ["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta", "Aswan", "Luxor", "Hurghada", "Sharm El-Sheikh"];
const ROLES = ["customer", "driver", "merchant", "admin"] as const;
const STATUSES = ["verified", "pending", "rejected"] as const;

// Generate 80 realistic mock users
export const MOCK_USERS_DB: MockUser[] = Array.from({ length: 80 }).map((_, idx) => {
  const firstName = FIRST_NAMES[idx % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(idx * 3) % LAST_NAMES.length];
  const city = CITIES[idx % CITIES.length];
  const role = ROLES[idx % ROLES.length];
  const id = `USR-${(1001 + idx).toString()}`;
  const isBanned = idx % 9 === 0;
  const isActive = !isBanned && idx % 7 !== 0;

  return {
    id,
    name: {
      en: `${firstName} ${lastName}`,
      ar: `${firstName} ${lastName}`,
    },
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idx}@example.com`,
    phone: `+20 10${Math.floor(10000000 + Math.random() * 90000000)}`,
    avatar: `https://i.pravatar.cc/150?u=${id}`,
    role,
    isActive,
    isBanned,
    spend: parseFloat((Math.random() * 5000 + 50).toFixed(2)),
    ordersCount: Math.floor(Math.random() * 45),
    status: STATUSES[idx % STATUSES.length],
    createdAt: new Date(Date.now() - idx * 86400000 * 2.5).toISOString(),
    address: {
      city,
      street: `St. ${idx + 1}, Block ${Math.floor(idx / 5) + 1}`,
    },
  };
});

/**
 * Simulates a server-side REST GET /api/v1/users endpoint with pagination, search, and sorting.
 */
export async function mockFetchUsersApi(params: ApiFetcherParams, signal?: AbortSignal): Promise<any> {
  // Simulate network latency (250ms)
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 250);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });

  let results = [...MOCK_USERS_DB];

  // 1. Server Search
  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    results = results.filter(
      (u) =>
        u.name.en.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.address.city.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }

  // 2. Server Sorting
  if (params.sortBy && params.sortOrder) {
    const sortField = params.sortBy;
    const isDesc = params.sortOrder === "desc";
    results.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField.includes(".")) {
        const parts = sortField.split(".");
        valA = parts.reduce((o, k) => o?.[k], a);
        valB = parts.reduce((o, k) => o?.[k], b);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return isDesc ? valB - valA : valA - valB;
      }
      return isDesc ? String(valB).localeCompare(String(valA)) : String(valA).localeCompare(String(valB));
    });
  }

  // 3. Server Pagination
  const total = results.length;
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (page - 1) * pageSize;
  const items = results.slice(startIndex, startIndex + pageSize);

  // Return standard REST format { data: [...], meta: { total, page, pageSize, totalPages } }
  return {
    data: items,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

/**
 * Simulates a non-standard / custom backend shape (e.g. { payload: { records: [...], count: 80 } })
 */
export async function mockFetchCustomShapeApi(params: ApiFetcherParams): Promise<any> {
  await new Promise((r) => setTimeout(r, 200));
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const start = (page - 1) * pageSize;

  return {
    status: "success",
    payload: {
      records: MOCK_USERS_DB.slice(start, start + pageSize),
      recordCount: MOCK_USERS_DB.length,
      currentNumber: page,
      limitSize: pageSize,
    },
  };
}

/**
 * Simulates a failing endpoint for error handling demonstration
 */
export async function mockFailingApi(): Promise<any> {
  await new Promise((r) => setTimeout(r, 400));
  throw new Error("HTTP 500: Database Connection Timeout. Please retry.");
}
