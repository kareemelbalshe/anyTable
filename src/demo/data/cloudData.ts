import { ApiFetcherParams } from "../../types/api.types";

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
