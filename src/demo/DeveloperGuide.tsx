import React, { useState } from "react";

interface DeveloperGuideProps {
  onCopySnippet: (text: string, title: string) => void;
}

export const DeveloperGuide: React.FC<DeveloperGuideProps> = ({ onCopySnippet }) => {
  const [activeSubTab, setActiveSubTab] = useState<"quickstart" | "protips" | "templates" | "api_tiers">("quickstart");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string, title: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    onCopySnippet(code, title);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="flex flex-col gap-6 any-table-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black tracking-wide w-fit">
              <span>🚀</span>
              <span>DEVELOPER CHEATSHEET & BEST PRACTICES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Mastering AnyTable in Production
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Designed by developers for developers. Learn how to unleash the full power of 3-tier API detection, TypeScript generics, built-in semantic column renderers, and imperative controller hooks.
            </p>
          </div>

          {/* Quick Install Snippet */}
          <div className="w-full lg:w-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow-lg flex flex-col gap-2">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Quick Install</span>
              <span className="text-emerald-500 font-mono">v1.0.1</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800">
              <code className="text-xs font-mono text-primary font-bold selection:bg-primary selection:text-white">
                npm i @kareemelbalshe/any-table
              </code>
              <button
                onClick={() => handleCopy("install", "npm i @kareemelbalshe/any-table", "Install Command")}
                className="ml-auto p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-slate-800 transition-all text-xs font-bold"
                title="Copy install command"
              >
                {copiedId === "install" ? "✓ Copied" : "📋 Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200/60 dark:border-gray-800/60">
          {[
            { id: "quickstart", label: "⚡ Quick Start (3 Lines of Code)", icon: "⚡" },
            { id: "api_tiers", label: "🌐 3-Tier API Architecture", icon: "🌐" },
            { id: "protips", label: "💡 7 Golden Pro Tips", icon: "💡" },
            { id: "templates", label: "📋 Production Code Templates", icon: "📋" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          SUBTAB 1: QUICK START
          ======================================================== */}
      {activeSubTab === "quickstart" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 any-table-fade-in">
          {/* Direct Array Data */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 font-black flex items-center justify-center text-sm">
                  1
                </span>
                <h3 className="font-black text-gray-900 dark:text-white text-base">
                  Client-Side Array (Zero Config)
                </h3>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    "quick_array",
                    `import { AnyTable } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";

export function UsersList({ users }) {
  // Auto-columns, client-side search, sort & pagination generated automatically!
  return <AnyTable data={users} title="Users Directory" />;
}`,
                    "Zero-Config Array"
                  )
                }
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-all text-gray-600 dark:text-gray-400"
              >
                {copiedId === "quick_array" ? "✓ Copied" : "📋 Copy"}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pass any raw JavaScript array. AnyTable automatically scans the first items, infers types (string, number, date, currency, boolean), builds search index, and paginates smoothly.
            </p>
            <pre className="p-4 rounded-2xl bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto border border-gray-800">
              {`import { AnyTable } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";

export function UsersList({ users }) {
  // Auto-columns, search, sort & pagination generated out-of-the-box!
  return <AnyTable data={users} title="Users Directory" />;
}`}
            </pre>
          </div>

          {/* Connected API Endpoint */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center text-sm">
                  2
                </span>
                <h3 className="font-black text-gray-900 dark:text-white text-base">
                  Server-Side REST API (Auto-Detection)
                </h3>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    "quick_api",
                    `import { AnyTable } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";

export function ProductsView() {
  return (
    <AnyTable
      title="Live Products Inventory"
      api={{
        url: "https://dummyjson.com/products",
        response: {
          dataPath: "products",
          totalPath: "total"
        }
      }}
    />
  );
}`,
                    "Server REST API"
                  )
                }
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-all text-gray-600 dark:text-gray-400"
              >
                {copiedId === "quick_api" ? "✓ Copied" : "📋 Copy"}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pass any REST endpoint. AnyTable handles debounced server search (300ms), query parameters (`page`, `pageSize`, `search`, `sortBy`), and skeleton loading indicators.
            </p>
            <pre className="p-4 rounded-2xl bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto border border-gray-800">
              {`import { AnyTable } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";

export function ProductsView() {
  return (
    <AnyTable
      title="Live Products Inventory"
      api={{
        url: "https://dummyjson.com/products",
        response: {
          dataPath: "products",
          totalPath: "total"
        }
      }}
    />
  );
}`}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================
          SUBTAB 2: 3-TIER API ARCHITECTURE
          ======================================================== */}
      {activeSubTab === "api_tiers" && (
        <div className="flex flex-col gap-6 any-table-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tier 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-base">
                T1
              </div>
              <h4 className="font-black text-base text-gray-900 dark:text-white">
                Tier 1: Zero-Config Auto
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Provide a standard URL string or direct array. AnyTable automatically probes response envelopes like `{`data: [...]`}`, `{`items: [...]`}`, or flat arrays.
              </p>
              <pre className="mt-auto p-3 rounded-xl bg-gray-900 text-gray-200 font-mono text-[11px] overflow-x-auto">
                {`<AnyTable api="/api/users" />`}
              </pre>
            </div>

            {/* Tier 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-black text-base">
                T2
              </div>
              <h4 className="font-black text-base text-gray-900 dark:text-white">
                Tier 2: Level 2 REST Mapping
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Map custom backend parameter names (e.g. Django, Laravel, Spring Boot, or NestJS) without writing a single line of state code.
              </p>
              <pre className="mt-auto p-3 rounded-xl bg-gray-900 text-gray-200 font-mono text-[11px] overflow-x-auto">
                {`api={{
  url: "/api/orders",
  params: {
    pageKey: "page_number",
    searchKey: "query"
  },
  response: {
    dataPath: "payload.items",
    totalPath: "meta.count"
  }
}}`}
              </pre>
            </div>

            {/* Tier 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-base">
                T3
              </div>
              <h4 className="font-black text-base text-gray-900 dark:text-white">
                Tier 3: Async Fetcher Function
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Seamlessly integrate with Axios instances, TanStack Query, GraphQL clients, or custom auth token interceptors.
              </p>
              <pre className="mt-auto p-3 rounded-xl bg-gray-900 text-gray-200 font-mono text-[11px] overflow-x-auto">
                {`api={{
  fetcher: async (params) => {
    const res = await myAxios.get(
      "/v1/customers", { params }
    );
    return {
      data: res.data.list,
      total: res.data.total
    };
  }
}}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUBTAB 3: 7 GOLDEN PRO TIPS
          ======================================================== */}
      {activeSubTab === "protips" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 any-table-fade-in">
          {[
            {
              num: "01",
              title: "Use TypeScript Generics for 100% Type Safety",
              desc: "Pass your interface to AnyTable<TData>. This ensures your column keys, render functions, and row action handlers have full IntelliSense autocomplete and catch typos at compile time.",
              code: `<AnyTable<EnterpriseOrder>
  columns={[
    { key: "customer.name", title: "Customer" },
    { key: "totalAmount", type: "currency", currency: "EGP" },
  ]}
/>`,
            },
            {
              num: "02",
              title: "Memoize Columns & Actions to Avoid Re-renders",
              desc: "Always wrap your columns and actions arrays in useMemo() if defined inside the component render body. This prevents the table from re-computing resolvers on irrelevant state updates.",
              code: `const columns = useMemo<ColumnDef<Order>[]>(() => [
  { key: "orderNumber", title: "Order #" },
  { key: "status", type: "status" }
], []);`,
            },
            {
              num: "03",
              title: "Leverage Built-in Semantic Column Types",
              desc: "Before writing custom render() functions, check if a built-in type fits your case. AnyTable provides currency, status, progress, rating, image, email, phone, date, datetime, and badge natively!",
              code: `{ key: "cpuUsage", title: "CPU Utilization", type: "progress" },
{ key: "salary", title: "Base Salary", type: "currency", currency: "USD" },
{ key: "rating", title: "Client Score", type: "rating" },`,
            },
            {
              num: "04",
              title: "Control Everything Programmatically with tableRef",
              desc: "Need to refresh the table after an external modal submits, or reset filters from a global search bar? Attach a tableRef and call tableRef.current?.refresh() or .setPage(1).",
              code: `const tableRef = useRef<TableInstance<User>>(null);
// Later:
tableRef.current?.refresh();
tableRef.current?.setSearch("Cairo");
tableRef.current?.clearSelection();`,
            },
            {
              num: "05",
              title: "Instant Interactive Switches in Action Columns",
              desc: "Create instant toggle actions (like isExpress, isActive, or autoRenew) with type: 'switch'. The table automatically displays a smooth animated toggle without manual boilerplates.",
              code: `{
  id: "active-switch",
  type: "switch",
  label: "Status",
  checked: (row) => row.isActive,
  onChange: async (row, val, ctx) => {
    await updateStatus(row.id, val);
    ctx.refresh();
  }
}`,
            },
            {
              num: "06",
              title: "Enable Safe Deletions with Built-in Confirmations",
              desc: "Prevent accidental deletions or cancellations! Add a confirmation object directly to your action. AnyTable renders a sleek accessible confirmation dialog automatically.",
              code: `{
  id: "delete-btn",
  label: "Delete",
  variant: "danger",
  confirmation: {
    title: "Delete Order",
    message: (row) => \`Permanently delete \${row.orderNumber}?\`,
    confirmText: "Delete"
  },
  onClick: async (row, ctx) => { /* ... */ }
}`,
            },
            {
              num: "07",
              title: "Seamless Light & Dark Mode Theming",
              desc: "AnyTable automatically adapts to Tailwind's .dark root class and supports 8 rich presets (default, midnight, emerald, ocean, luxury, crimson, minimal, corporate).",
              code: `<AnyTable
  preset="emerald"
  theme={{
    borderRadius: "1.25rem",
    density: "normal"
  }}
/>`,
            },
          ].map((tip) => (
            <div
              key={tip.num}
              className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  TIP {tip.num}
                </span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{tip.title}</h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
              <pre className="mt-auto p-3 rounded-xl bg-gray-900 text-gray-200 font-mono text-[11px] overflow-x-auto border border-gray-800">
                {tip.code}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          SUBTAB 4: PRODUCTION CODE TEMPLATES
          ======================================================== */}
      {activeSubTab === "templates" && (
        <div className="flex flex-col gap-6 any-table-fade-in">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white">
                  Full Enterprise Table Template
                </h3>
                <p className="text-xs text-gray-500">
                  Complete setup with server pagination, selection, actions, switches, and custom styling.
                </p>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    "full_template",
                    `import React, { useRef, useMemo } from "react";
import { AnyTable, TableInstance, ColumnDef } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";

interface Customer {
  id: string;
  name: string;
  email: string;
  balance: number;
  status: "Active" | "Pending" | "Suspended";
  isVerified: boolean;
}

export function CustomerDirectory() {
  const tableRef = useRef<TableInstance<Customer>>(null);

  const columns = useMemo<ColumnDef<Customer>[]>(() => [
    { key: "name", title: "Customer Name", sortable: true },
    { key: "email", title: "Email", type: "email" },
    { key: "balance", title: "Account Balance", type: "currency", currency: "USD", sortable: true },
    {
      key: "status",
      title: "Account Status",
      type: "status",
      statusMap: {
        Active: { label: "Active", variant: "success" },
        Pending: { label: "Pending", variant: "warning" },
        Suspended: { label: "Suspended", variant: "danger" }
      }
    }
  ], []);

  return (
    <AnyTable<Customer>
      tableRef={tableRef}
      title="Enterprise Customers"
      subtitle="Live account balances and verification controls"
      rowKey="id"
      selectable
      onSelectionChange={(rows, keys) => {
        console.log("Selected IDs:", keys);
      }}
      api={{
        url: "/api/customers",
        response: { dataPath: "data", totalPath: "total" }
      }}
      columns={columns}
      actions={[
        {
          id: "verify-switch",
          type: "switch",
          label: "Verified",
          checked: (row) => row.isVerified,
          onChange: async (row, val, ctx) => {
            row.isVerified = val;
            ctx.refresh();
          }
        },
        {
          id: "edit",
          label: "Edit",
          icon: "✏️",
          variant: "primary",
          onClick: (row) => alert("Edit " + row.name)
        }
      ]}
    />
  );
}`,
                    "Enterprise Table Template"
                  )
                }
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary text-white shadow-md hover:bg-primary-soft transition-all"
              >
                {copiedId === "full_template" ? "✓ Copied to Clipboard!" : "📋 Copy Template"}
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto border border-gray-800 leading-relaxed">
              {`import React, { useRef, useMemo } from "react";
import { AnyTable, TableInstance, ColumnDef } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";

interface Customer {
  id: string;
  name: string;
  email: string;
  balance: number;
  status: "Active" | "Pending" | "Suspended";
  isVerified: boolean;
}

export function CustomerDirectory() {
  const tableRef = useRef<TableInstance<Customer>>(null);

  const columns = useMemo<ColumnDef<Customer>[]>(() => [
    { key: "name", title: "Customer Name", sortable: true },
    { key: "email", title: "Email", type: "email" },
    { key: "balance", title: "Account Balance", type: "currency", currency: "USD", sortable: true },
    {
      key: "status",
      title: "Account Status",
      type: "status",
      statusMap: {
        Active: { label: "Active", variant: "success" },
        Pending: { label: "Pending", variant: "warning" },
        Suspended: { label: "Suspended", variant: "danger" }
      }
    }
  ], []);

  return (
    <AnyTable<Customer>
      tableRef={tableRef}
      title="Enterprise Customers"
      subtitle="Live account balances and verification controls"
      rowKey="id"
      selectable
      onSelectionChange={(rows, keys) => {
        console.log("Selected IDs:", keys);
      }}
      api={{
        url: "/api/customers",
        response: { dataPath: "data", totalPath: "total" }
      }}
      columns={columns}
      actions={[
        {
          id: "verify-switch",
          type: "switch",
          label: "Verified",
          checked: (row) => row.isVerified,
          onChange: async (row, val, ctx) => {
            row.isVerified = val;
            ctx.refresh();
          }
        },
        {
          id: "edit",
          label: "Edit",
          icon: "✏️",
          variant: "primary",
          onClick: (row) => alert("Edit " + row.name)
        }
      ]}
    />
  );
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
