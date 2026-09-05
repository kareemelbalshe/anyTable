import React, { useState, useRef, useMemo, useEffect } from "react";
import { AnyTable } from "../components/AnyTable";
import { TableInstance } from "../types/table.types";
import { TablePreset } from "../types/theme.types";
import {
  EnterpriseOrder,
  REAL_WORLD_ORDERS_DB,
  fetchEnterpriseOrdersApi,
} from "./enterpriseOrdersData";
import {
  fetchDummyJsonProducts,
  fetchDummyJsonUsers,
  fetchGitHubRepositories,
  fetchRickAndMortyCharacters,
} from "./externalApis";
import {
  MOCK_USERS_DB,
  mockFetchUsersApi,
  mockFailingApi,
  MockUser,
} from "./mockApi";
import {
  SaaSSubscription,
  fetchSaaSSubscriptionsApi,
  HREmployee,
  fetchHREmployeesApi,
  CloudServerNode,
  fetchCloudServersApi,
  MedicalAppointment,
  fetchMedicalAppointmentsApi,
} from "./realWorldData";
import { DeveloperGuide } from "./DeveloperGuide";
import "../theme/any-table.css";

export default function App() {
  type DemoTab =
    | "enterprise"
    | "saas_billing"
    | "hr_employees"
    | "devops_cloud"
    | "healthcare"
    | "dummy_products"
    | "dummy_users"
    | "github_repos"
    | "rick_morty"
    | "ref_controller"
    | "error_states"
    | "dev_guide";

  const [activeTab, setActiveTab] = useState<DemoTab>("enterprise");
  const [selectedPreset, setSelectedPreset] = useState<TablePreset>("default");
  
  // Theme state synced with HTML document and localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("anytable_theme");
      if (saved) return saved === "dark";
      return true; // default dark
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("anytable_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("anytable_theme", "light");
    }
  }, [isDarkMode]);

  const [notification, setNotification] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<EnterpriseOrder | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [enterpriseFilterTier, setEnterpriseFilterTier] = useState<string | null>(null);

  // Table Controller Refs
  const enterpriseTableRef = useRef<TableInstance<EnterpriseOrder>>(null);
  const saasTableRef = useRef<TableInstance<SaaSSubscription>>(null);
  const hrTableRef = useRef<TableInstance<HREmployee>>(null);
  const cloudTableRef = useRef<TableInstance<CloudServerNode>>(null);
  const medicalTableRef = useRef<TableInstance<MedicalAppointment>>(null);
  const productsTableRef = useRef<TableInstance<any>>(null);
  const usersTableRef = useRef<TableInstance<any>>(null);
  const githubTableRef = useRef<TableInstance<any>>(null);
  const refDemoTableRef = useRef<TableInstance<MockUser>>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  // Enterprise KPI Summary
  const kpiStats = useMemo(() => {
    const totalGmv = REAL_WORLD_ORDERS_DB.reduce((sum, o) => sum + o.totalAmount, 0);
    const deliveredCount = REAL_WORLD_ORDERS_DB.filter((o) => o.fulfillmentStatus === "Delivered").length;
    const inTransitCount = REAL_WORLD_ORDERS_DB.filter((o) => o.fulfillmentStatus === "In Transit" || o.fulfillmentStatus === "Processing").length;
    const vipOrders = REAL_WORLD_ORDERS_DB.filter((o) => o.customer.tier === "VIP Platinum").length;

    return {
      totalGmv: totalGmv.toLocaleString("en-US"),
      deliveredCount,
      inTransitCount,
      vipOrders,
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} transition-colors duration-300 flex flex-col`}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl shadow-primary/30 any-table-fade-in flex items-center gap-2.5 border border-white/20">
          <span className="text-base">✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm any-table-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl overflow-hidden flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-black">
                  📄
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900 dark:text-white">
                    Invoice {selectedInvoiceOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Issued on {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 text-sm font-bold flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs border border-gray-100 dark:border-gray-800">
              <div>
                <div className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-1">Customer</div>
                <div className="font-bold text-gray-900 dark:text-white">{selectedInvoiceOrder.customer.name}</div>
                <div className="text-gray-500">{selectedInvoiceOrder.customer.email}</div>
                <div className="text-gray-500">{selectedInvoiceOrder.customer.phone}</div>
              </div>
              <div>
                <div className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-1">Delivery Destination</div>
                <div className="font-bold text-gray-900 dark:text-white">{selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.governorate}</div>
                <div className="text-gray-500">{selectedInvoiceOrder.shippingAddress.street}</div>
                <div className="text-primary font-semibold mt-1">Carrier: {selectedInvoiceOrder.carrier}</div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Purchased Items</div>
              <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 dark:bg-slate-800 font-bold text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {selectedInvoiceOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-gray-900 dark:text-white">{item.name}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">{item.unitPrice.toLocaleString()} EGP</td>
                        <td className="p-3 text-right font-mono font-bold">{(item.quantity * item.unitPrice).toLocaleString()} EGP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="flex flex-col gap-1.5 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl text-xs border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">{selectedInvoiceOrder.subtotal.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>VAT (14%):</span>
                <span className="font-mono font-bold">{selectedInvoiceOrder.tax.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee:</span>
                <span className="font-mono font-bold">{selectedInvoiceOrder.shippingFee === 0 ? "FREE" : `${selectedInvoiceOrder.shippingFee} EGP`}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1 pt-2 flex justify-between font-black text-sm text-gray-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-primary font-mono text-base">{selectedInvoiceOrder.totalAmount.toLocaleString()} EGP</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
              >
                🖨️ Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-soft shadow-md shadow-primary/20 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          HEADER BAR WITH AUTHOR BADGE & REPO LINKS
          ======================================================== */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <a href="https://kareemelbalshe.github.io/anyTable/" className="group flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}logo.svg`}
                alt="AnyTable Logo"
                className="w-10 h-10 rounded-2xl shadow-md shadow-primary/20 object-contain border border-primary/20 transition-transform group-hover:scale-105"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  AnyTable
                  <span className="text-[10px] sm:text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">
                    v1.0.1
                  </span>
                </h1>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                  Smart Autonomous Data Table for React
                </p>
              </div>
            </a>
          </div>

          {/* Author Badge & Quick Ecosystem Links */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">
            {/* Author Profile Link */}
            <a
              href="https://github.com/kareemelbalshe"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all shadow-sm group"
              title="Creator: Kareem Elbalshe on GitHub"
            >
              <img
                src="https://github.com/kareemelbalshe.png"
                alt="Kareem Elbalshe"
                className="w-5 h-5 rounded-full object-cover border border-primary/40 group-hover:scale-110 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="hidden md:inline text-gray-500 dark:text-gray-400 font-normal">By</span>
              <span className="font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                Kareem Elbalshe
              </span>
              <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.2 rounded font-mono">
                Creator
              </span>
            </a>

            {/* Official Repo Link */}
            <a
              href="https://github.com/kareemelbalshe/anyTable"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-black shadow-sm hover:opacity-90 transition-all"
            >
              <span>🐙</span>
              <span className="hidden sm:inline">GitHub Repo</span>
              <span className="text-amber-400 dark:text-amber-600 font-normal">★</span>
            </a>

            {/* Preset Selector */}
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 hidden lg:inline">🎨 Preset:</span>
              <select
                value={selectedPreset}
                onChange={(e) => {
                  setSelectedPreset(e.target.value as TablePreset);
                  showToast(`Theme preset switched to: ${e.target.value.toUpperCase()}`);
                }}
                className="bg-transparent text-xs font-black text-gray-900 dark:text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="default" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Default (Wasel Blue)</option>
                <option value="midnight" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Midnight (Neon Indigo)</option>
                <option value="emerald" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Emerald (Fintech Green)</option>
                <option value="ocean" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Ocean (Deep Cyan)</option>
                <option value="luxury" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Luxury (Gold)</option>
                <option value="crimson" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Crimson (Rose)</option>
                <option value="minimal" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Minimal</option>
                <option value="corporate" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Corporate</option>
              </select>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
              title="Toggle Light / Dark Mode"
            >
              <span>{isDarkMode ? "☀️ Light" : "🌙 Dark"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 flex-1 w-full">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-gray-100/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-gray-800 backdrop-blur-md">
          {[
            { id: "enterprise", label: "🏢 Enterprise Orders", badge: "Logistics" },
            { id: "saas_billing", label: "💳 SaaS Billing", badge: "Fintech" },
            { id: "hr_employees", label: "👥 HR & Team", badge: "Salaries" },
            { id: "devops_cloud", label: "🖥️ Cloud DevOps", badge: "Telemetry" },
            { id: "healthcare", label: "🏥 Healthcare CRM", badge: "Clinic" },
            { id: "dummy_products", label: "🛍️ DummyJSON Products", badge: "Live API" },
            { id: "dummy_users", label: "👤 DummyJSON Users", badge: "Live API" },
            { id: "github_repos", label: "🐙 GitHub Search", badge: "Live API" },
            { id: "rick_morty", label: "🧪 Rick & Morty", badge: "Live API" },
            { id: "ref_controller", label: "🕹️ Controller", badge: "tableRef" },
            { id: "error_states", label: "🛡️ Error Boundary", badge: "Resilience" },
            { id: "dev_guide", label: "📖 Developer Guide & Tips", badge: "Pro Tips" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DemoTab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md shadow-primary/30 scale-[1.02]"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-200/70 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* ========================================================
            TAB 1: ENTERPRISE ORDERS & FULFILLMENT
            ======================================================== */}
        {activeTab === "enterprise" && (
          <div className="flex flex-col gap-6 any-table-fade-in">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl font-black">
                  💰
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total GMV Volume</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{kpiStats.totalGmv} EGP</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl font-black">
                  📦
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Shipments</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{kpiStats.inTransitCount} In Transit</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl font-black">
                  👑
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">VIP Platinum Orders</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{kpiStats.vipOrders} Orders</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-black">
                  ⚡
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Delivered Rate</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{Math.round((kpiStats.deliveredCount / 120) * 100)}% Success</div>
                </div>
              </div>
            </div>

            {/* Batch Selection Action Bar */}
            {selectedOrderIds.length > 0 && (
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 any-table-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <span>✅</span>
                  <span>{selectedOrderIds.length} Orders Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showToast(`Exported ${selectedOrderIds.length} orders to CSV successfully!`);
                    }}
                    className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-soft active:scale-95 transition-all"
                  >
                    📥 Export CSV
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Marked ${selectedOrderIds.length} orders as Express Priority!`);
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-amber-600 active:scale-95 transition-all"
                  >
                    ⚡ Bulk Prioritize
                  </button>
                  <button
                    onClick={() => {
                      enterpriseTableRef.current?.clearSelection();
                      setSelectedOrderIds([]);
                    }}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-slate-800 text-xs font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-slate-700 transition-all"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* Main Enterprise Table */}
            <AnyTable<EnterpriseOrder>
              preset={selectedPreset}
              tableRef={enterpriseTableRef}
              title="Enterprise Orders & Logistics Fulfillment"
              subtitle="Full-featured enterprise table with server search, multi-tier status badges, instant PATCH switches, and invoice popups."
              rowKey="id"
              api={{
                fetcher: fetchEnterpriseOrdersApi,
                params: enterpriseFilterTier ? { tier: enterpriseFilterTier } : undefined,
              }}
              headerActions={
                <div className="flex items-center gap-2">
                  {/* Preset Filter */}
                  <select
                    value={enterpriseFilterTier || ""}
                    onChange={(e) => {
                      const val = e.target.value || null;
                      setEnterpriseFilterTier(val);
                      enterpriseTableRef.current?.refresh();
                    }}
                    className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Customer Tiers</option>
                    <option value="VIP Platinum">👑 VIP Platinum</option>
                    <option value="Gold">🥇 Gold</option>
                    <option value="Silver">🥈 Silver</option>
                    <option value="Standard">Standard</option>
                  </select>

                  <button
                    onClick={() => {
                      showToast("Opened 'Create New Order' Wizard!");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-soft shadow-md shadow-primary/20 active:scale-95 transition-all"
                  >
                    <span>＋</span>
                    <span>New Order</span>
                  </button>
                </div>
              }
              columns={[
                {
                  key: "orderNumber",
                  title: "Order #",
                  width: 110,
                  sortable: true,
                  render: (val) => (
                    <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
                      {val}
                    </span>
                  ),
                },
                {
                  key: "customer.name",
                  title: "Customer Profile",
                  sortable: true,
                  render: (_, row) => (
                    <div className="flex items-center gap-3">
                      <img
                        src={row.customer.avatar}
                        alt="Customer"
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                          {row.customer.name}
                          {row.customer.tier === "VIP Platinum" && (
                            <span className="text-[10px] bg-amber-500/10 text-amber-500 font-black px-1.5 py-0.2 rounded border border-amber-500/20">
                              👑 VIP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">{row.customer.phone}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "itemCount",
                  title: "Products",
                  render: (count, row) => (
                    <div>
                      <div className="font-bold text-xs text-gray-800 dark:text-gray-200">
                        {count} item{count > 1 ? "s" : ""}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[140px]" title={row.items.map((i) => i.name).join(", ")}>
                        {row.items[0]?.name}
                        {row.items.length > 1 && ` +${row.items.length - 1} more`}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "totalAmount",
                  title: "Total Amount",
                  type: "currency",
                  currency: "EGP",
                  sortable: true,
                },
                {
                  key: "paymentStatus",
                  title: "Payment",
                  type: "status",
                  sortable: true,
                  statusMap: {
                    Paid: { label: "Paid", variant: "success" },
                    Pending: { label: "Pending", variant: "warning" },
                    Refunded: { label: "Refunded", variant: "neutral" },
                    Failed: { label: "Failed", variant: "danger" },
                  },
                },
                {
                  key: "fulfillmentStatus",
                  title: "Fulfillment",
                  type: "status",
                  sortable: true,
                  statusMap: {
                    Delivered: { label: "Delivered", variant: "success" },
                    "In Transit": { label: "In Transit", variant: "info" },
                    Processing: { label: "Processing", variant: "warning" },
                    "Out for Delivery": { label: "Out for Delivery", variant: "info" },
                    Cancelled: { label: "Cancelled", variant: "danger" },
                  },
                },
                {
                  key: "shippingAddress.city",
                  title: "Destination",
                  sortable: true,
                  render: (_, row) => (
                    <div className="text-xs">
                      <div className="font-bold text-gray-800 dark:text-gray-200">📍 {row.shippingAddress.city}</div>
                      <div className="text-[11px] text-gray-400">{row.carrier}</div>
                    </div>
                  ),
                },
              ]}
              actions={[
                {
                  id: "express-toggle",
                  type: "switch",
                  label: "Express",
                  checked: (row) => row.isExpressShipping,
                  onChange: async (row, nextChecked, context) => {
                    row.isExpressShipping = nextChecked;
                    showToast(`Order ${row.orderNumber}: Express Shipping set to ${nextChecked ? "ON ⚡" : "OFF"}`);
                    context.refresh();
                  },
                },
                {
                  id: "view-invoice",
                  label: "Invoice",
                  icon: "📄",
                  variant: "primary",
                  onClick: (row) => setSelectedInvoiceOrder(row),
                },
                {
                  id: "whatsapp",
                  label: "WhatsApp",
                  icon: "💬",
                  variant: "success",
                  onClick: (row) => showToast(`Opening WhatsApp chat with ${row.customer.name} (${row.customer.phone})`),
                },
                {
                  id: "cancel-order",
                  label: "Cancel",
                  icon: "🗑️",
                  variant: "danger",
                  show: (row) => row.fulfillmentStatus !== "Cancelled" && row.fulfillmentStatus !== "Delivered",
                  confirmation: {
                    title: "Cancel & Refund Order",
                    message: (row) => `Are you sure you want to cancel ${row.orderNumber} for ${row.customer.name}? Total amount (${row.totalAmount.toLocaleString()} EGP) will be refunded.`,
                    confirmText: "Yes, Cancel Order",
                    cancelText: "Keep Active",
                  },
                  onClick: async (row, context) => {
                    row.fulfillmentStatus = "Cancelled";
                    row.paymentStatus = "Refunded";
                    showToast(`Order ${row.orderNumber} has been CANCELLED and REFUNDED.`);
                    context.refresh();
                  },
                },
              ]}
              selectable
              onSelectionChange={(_, keys) => {
                setSelectedOrderIds(keys as string[]);
              }}
            />
          </div>
        )}

        {/* ========================================================
            TAB 2: SAAS SUBSCRIPTIONS & FINANCIAL TRANSACTIONS
            ======================================================== */}
        {activeTab === "saas_billing" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between">
              <div>
                💳 <strong>SaaS Subscription Metrics:</strong> Demonstrates recurring billing, MRR in USD, payment gateways, and live switches for auto-renewals.
              </div>
              <span className="bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                FINTECH
              </span>
            </div>

            <AnyTable<SaaSSubscription>
              preset={selectedPreset}
              tableRef={saasTableRef}
              title="SaaS Subscriptions & Accounts"
              subtitle="Manage customer licenses, MRR, renewal cycles, and gateway transactions"
              rowKey="id"
              api={{
                fetcher: fetchSaaSSubscriptionsApi,
              }}
              columns={[
                {
                  key: "company",
                  title: "Company Account",
                  sortable: true,
                  render: (_, row) => (
                    <div className="flex items-center gap-3">
                      <img
                        src={row.logo}
                        alt={row.company}
                        className="w-9 h-9 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-xs text-gray-900 dark:text-white">{row.company}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{row.domain}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "plan",
                  title: "Tier Plan",
                  type: "badge",
                  sortable: true,
                },
                {
                  key: "mrr",
                  title: "Monthly Revenue (MRR)",
                  type: "currency",
                  currency: "$",
                  sortable: true,
                },
                {
                  key: "billingCycle",
                  title: "Cycle",
                  render: (cycle) => (
                    <span className={`font-bold text-xs px-2 py-0.5 rounded-md ${cycle === "Annual" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"}`}>
                      {cycle}
                    </span>
                  ),
                },
                {
                  key: "seats",
                  title: "Seats",
                  width: 90,
                  align: "center",
                  render: (seats) => <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">{seats} users</span>,
                },
                {
                  key: "paymentGateway",
                  title: "Gateway",
                  render: (gw) => (
                    <span className="font-bold text-xs text-gray-800 dark:text-gray-200">
                      ⚡ {gw}
                    </span>
                  ),
                },
                {
                  key: "status",
                  title: "Status",
                  type: "status",
                  sortable: true,
                  statusMap: {
                    Active: { label: "Active", variant: "success" },
                    "Past Due": { label: "Past Due", variant: "danger" },
                    Trialing: { label: "Trialing", variant: "warning" },
                    Cancelled: { label: "Cancelled", variant: "neutral" },
                  },
                },
                {
                  key: "nextInvoiceDate",
                  title: "Next Invoice",
                  type: "date",
                  sortable: true,
                },
              ]}
              actions={[
                {
                  id: "auto-renew",
                  type: "switch",
                  label: "Auto-Renew",
                  checked: (row) => row.autoRenew,
                  onChange: async (row, val, ctx) => {
                    row.autoRenew = val;
                    showToast(`${row.company}: Auto-Renewal set to ${val ? "ON" : "OFF"}`);
                    ctx.refresh();
                  },
                },
                {
                  id: "download-invoice",
                  label: "Receipt",
                  icon: "📥",
                  variant: "neutral",
                  onClick: (row) => showToast(`Generating PDF receipt for ${row.company} ($${row.mrr}/mo)`),
                },
              ]}
            />
          </div>
        )}

        {/* ========================================================
            TAB 3: HR & EMPLOYEE MANAGEMENT DIRECTORY
            ======================================================== */}
        {activeTab === "hr_employees" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl text-xs text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
              <div>
                👥 <strong>HR & Talent Directory:</strong> Features employee avatars, performance ratings (built-in <code>rating</code> type), salaries in EGP, and contact triggers.
              </div>
              <span className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                HR TECH
              </span>
            </div>

            <AnyTable<HREmployee>
              preset={selectedPreset}
              tableRef={hrTableRef}
              title="Employee Directory & Compensation"
              subtitle="Staff profiles, department segmentation, performance reviews and salaries"
              rowKey="id"
              api={{
                fetcher: fetchHREmployeesApi,
              }}
              columns={[
                {
                  key: "avatar",
                  title: "Employee",
                  type: "image",
                  width: 60,
                  align: "center",
                },
                {
                  key: "name",
                  title: "Full Name",
                  sortable: true,
                  render: (name, row) => (
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white">{name}</div>
                      <div className="text-[11px] text-gray-400">{row.role}</div>
                    </div>
                  ),
                },
                {
                  key: "department",
                  title: "Department",
                  type: "badge",
                  sortable: true,
                },
                {
                  key: "salary",
                  title: "Base Salary",
                  type: "currency",
                  currency: "EGP",
                  sortable: true,
                },
                {
                  key: "performanceRating",
                  title: "Score",
                  type: "rating",
                  sortable: true,
                },
                {
                  key: "status",
                  title: "Work Status",
                  type: "status",
                  sortable: true,
                  statusMap: {
                    Active: { label: "Active", variant: "success" },
                    Remote: { label: "Remote", variant: "info" },
                    "On Leave": { label: "On Leave", variant: "warning" },
                    Probation: { label: "Probation", variant: "neutral" },
                  },
                },
                {
                  key: "email",
                  title: "Email",
                  type: "email",
                },
                {
                  key: "phone",
                  title: "Phone",
                  type: "phone",
                },
              ]}
              actions={[
                {
                  id: "promote",
                  label: "Review",
                  icon: "⭐",
                  variant: "primary",
                  onClick: (row) => showToast(`Opened performance review modal for ${row.name}`),
                },
              ]}
            />
          </div>
        )}

        {/* ========================================================
            TAB 4: CLOUD INFRASTRUCTURE & DEVOPS HEALTH
            ======================================================== */}
        {activeTab === "devops_cloud" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <div>
                🖥️ <strong>DevOps Telemetry Grid:</strong> Shows server nodes with native <code>progress</code> bars for CPU & Memory, latency indicators, and protection switches.
              </div>
              <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                DEVOPS
              </span>
            </div>

            <AnyTable<CloudServerNode>
              preset={selectedPreset}
              tableRef={cloudTableRef}
              title="Cloud Infrastructure & Nodes Health"
              subtitle="Real-time telemetry, memory load, latency thresholds, and automated restarts"
              rowKey="id"
              api={{
                fetcher: fetchCloudServersApi,
              }}
              columns={[
                {
                  key: "hostname",
                  title: "Node Hostname",
                  sortable: true,
                  render: (host, row) => (
                    <div>
                      <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">{host}</span>
                      <div className="text-[11px] text-gray-400 font-mono">{row.ip}</div>
                    </div>
                  ),
                },
                {
                  key: "region",
                  title: "Region",
                  sortable: true,
                },
                {
                  key: "cpuUsage",
                  title: "CPU Utilization",
                  type: "progress",
                  sortable: true,
                },
                {
                  key: "memoryUsage",
                  title: "RAM Utilization",
                  type: "progress",
                  sortable: true,
                },
                {
                  key: "latency",
                  title: "Ping (ms)",
                  sortable: true,
                  render: (latency) => (
                    <span className={`font-mono text-xs font-bold ${latency === 0 ? "text-gray-400" : latency < 35 ? "text-emerald-500" : latency < 80 ? "text-amber-500" : "text-rose-500"}`}>
                      {latency} ms
                    </span>
                  ),
                },
                {
                  key: "uptime",
                  title: "Uptime",
                  render: (uptime) => <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{uptime}</span>,
                },
                {
                  key: "status",
                  title: "Node Health",
                  type: "status",
                  sortable: true,
                  statusMap: {
                    Healthy: { label: "Healthy", variant: "success" },
                    Warning: { label: "High Load", variant: "warning" },
                    Critical: { label: "Critical", variant: "danger" },
                    Maintenance: { label: "Maintenance", variant: "neutral" },
                  },
                },
              ]}
              actions={[
                {
                  id: "protect-node",
                  type: "switch",
                  label: "DDoS Guard",
                  checked: (row) => row.isProtected,
                  onChange: async (row, val, ctx) => {
                    row.isProtected = val;
                    showToast(`${row.hostname}: DDoS Protection set to ${val ? "ACTIVE 🛡️" : "OFF"}`);
                    ctx.refresh();
                  },
                },
                {
                  id: "restart-node",
                  label: "Reboot",
                  icon: "🔄",
                  variant: "danger",
                  confirmation: {
                    title: "Reboot Server Node",
                    message: (row) => `Are you sure you want to reboot ${row.hostname}? Services may experience momentary downtime.`,
                    confirmText: "Yes, Reboot Now",
                    cancelText: "Cancel",
                  },
                  onClick: async (row, ctx) => {
                    showToast(`Reboot signal sent to ${row.hostname}...`);
                    ctx.refresh();
                  },
                },
              ]}
            />
          </div>
        )}

        {/* ========================================================
            TAB 5: HEALTHCARE & CLINIC CRM
            ======================================================== */}
        {activeTab === "healthcare" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
              <div>
                🏥 <strong>Healthcare & Clinic Management:</strong> Patient triages (Critical, Urgent, Normal), consultation dates, doctors, and insurance statuses.
              </div>
              <span className="bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                HEALTHCARE
              </span>
            </div>

            <AnyTable<MedicalAppointment>
              preset={selectedPreset}
              tableRef={medicalTableRef}
              title="Clinical Appointments & Patient Triage"
              subtitle="Doctor allocations, appointment priority levels, and insurance claims"
              rowKey="id"
              api={{
                fetcher: fetchMedicalAppointmentsApi,
              }}
              columns={[
                {
                  key: "patientName",
                  title: "Patient",
                  sortable: true,
                  render: (name, row) => (
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white">{name}</div>
                      <div className="text-[11px] text-gray-400">{row.patientAge} years old</div>
                    </div>
                  ),
                },
                {
                  key: "doctor",
                  title: "Assigned Physician",
                  sortable: true,
                  render: (doc, row) => (
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white">{doc}</div>
                      <div className="text-[11px] text-primary font-semibold">{row.specialty}</div>
                    </div>
                  ),
                },
                {
                  key: "appointmentDate",
                  title: "Date & Time",
                  type: "datetime",
                  sortable: true,
                },
                {
                  key: "triage",
                  title: "Triage Priority",
                  sortable: true,
                  render: (triage) => (
                    <span className={`font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      triage === "Critical"
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                        : triage === "Urgent"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {triage}
                    </span>
                  ),
                },
                {
                  key: "type",
                  title: "Consultation Type",
                  render: (type) => (
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {type === "In-Person" ? "🏥 In-Person" : "💻 Telehealth"}
                    </span>
                  ),
                },
                {
                  key: "fee",
                  title: "Consultation Fee",
                  type: "currency",
                  currency: "EGP",
                  sortable: true,
                },
                {
                  key: "insuranceCovered",
                  title: "Insurance",
                  type: "boolean",
                },
                {
                  key: "status",
                  title: "Status",
                  type: "status",
                  sortable: true,
                  statusMap: {
                    Waiting: { label: "Waiting", variant: "warning" },
                    "In Consultation": { label: "In Consultation", variant: "info" },
                    Confirmed: { label: "Confirmed", variant: "neutral" },
                    Completed: { label: "Completed", variant: "success" },
                    Cancelled: { label: "Cancelled", variant: "danger" },
                  },
                },
              ]}
              actions={[
                {
                  id: "consult-btn",
                  label: "Call Patient",
                  icon: "🔔",
                  variant: "primary",
                  onClick: (row) => showToast(`Calling patient ${row.patientName} to Examination Room`),
                },
              ]}
            />
          </div>
        )}

        {/* ========================================================
            TAB 6: LIVE API: DUMMYJSON PRODUCTS
            ======================================================== */}
        {activeTab === "dummy_products" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <div>
                🛍️ <strong>Live Real-World API:</strong> Connected directly to <code>https://dummyjson.com/products</code> with server-side pagination, sorting, and debounced search.
              </div>
              <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                LIVE API
              </span>
            </div>

            <AnyTable
              preset={selectedPreset}
              tableRef={productsTableRef}
              title="DummyJSON Products Inventory"
              subtitle="Fetching real e-commerce inventory with server pagination and search"
              rowKey="id"
              api={{
                fetcher: fetchDummyJsonProducts,
                response: {
                  dataPath: "products",
                  totalPath: "total",
                },
              }}
              columns={[
                {
                  key: "thumbnail",
                  title: "Image",
                  type: "image",
                  width: 70,
                  align: "center",
                },
                {
                  key: "title",
                  title: "Product Title",
                  sortable: true,
                  render: (val, row) => (
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white">{val}</div>
                      <div className="text-[11px] text-gray-400 capitalize">{row.brand || row.category}</div>
                    </div>
                  ),
                },
                {
                  key: "category",
                  title: "Category",
                  type: "badge",
                },
                {
                  key: "price",
                  title: "Price",
                  type: "currency",
                  currency: "$",
                  sortable: true,
                },
                {
                  key: "rating",
                  title: "Customer Rating",
                  type: "rating",
                  sortable: true,
                },
                {
                  key: "stock",
                  title: "In Stock",
                  render: (val) => (
                    <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${val > 20 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                      {val} units
                    </span>
                  ),
                },
              ]}
              actions={[
                {
                  id: "order-product",
                  label: "Add to Cart",
                  icon: "🛒",
                  variant: "primary",
                  onClick: (row) => showToast(`Added "${row.title}" ($${row.price}) to cart!`),
                },
              ]}
              selectable
            />
          </div>
        )}

        {/* ========================================================
            TAB 7: LIVE API: DUMMYJSON USERS
            ======================================================== */}
        {activeTab === "dummy_users" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl text-xs text-sky-700 dark:text-sky-300 flex items-center justify-between">
              <div>
                👥 <strong>Live Real-World API:</strong> Connected directly to <code>https://dummyjson.com/users</code> with server-side pagination & live search.
              </div>
              <span className="bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                LIVE API
              </span>
            </div>

            <AnyTable
              preset={selectedPreset}
              tableRef={usersTableRef}
              title="DummyJSON Global Directory"
              subtitle="Loaded live from DummyJSON Users REST API"
              rowKey="id"
              api={{
                fetcher: fetchDummyJsonUsers,
                response: {
                  dataPath: "users",
                  totalPath: "total",
                },
              }}
              columns={[
                {
                  key: "image",
                  title: "Avatar",
                  type: "image",
                  width: 70,
                  align: "center",
                },
                {
                  key: "firstName",
                  title: "Full Name",
                  render: (_, row) => (
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white">
                        {row.firstName} {row.lastName}
                      </div>
                      <div className="text-[11px] text-gray-400">{row.company?.title || row.role}</div>
                    </div>
                  ),
                },
                {
                  key: "email",
                  title: "Email",
                  type: "email",
                },
                {
                  key: "phone",
                  title: "Phone",
                  type: "phone",
                },
                {
                  key: "age",
                  title: "Age",
                  width: 80,
                  align: "center",
                },
                {
                  key: "company.department",
                  title: "Department",
                  type: "badge",
                },
                {
                  key: "address.city",
                  title: "City",
                },
              ]}
              actions={[
                {
                  id: "mail-user",
                  label: "Message",
                  icon: "✉️",
                  variant: "neutral",
                  onClick: (row) => showToast(`Opening message composer for ${row.email}`),
                },
              ]}
            />
          </div>
        )}

        {/* ========================================================
            TAB 8: LIVE API: GITHUB REPOSITORIES
            ======================================================== */}
        {activeTab === "github_repos" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl text-xs text-purple-700 dark:text-purple-300 flex items-center justify-between">
              <div>
                🐙 <strong>Live GitHub Search API:</strong> Connected directly to <code>https://api.github.com/search/repositories</code>. Try searching terms like &quot;react&quot;, &quot;tailwind&quot;, &quot;rust&quot;, &quot;nextjs&quot;!
              </div>
              <span className="bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                PUBLIC GITHUB API
              </span>
            </div>

            <AnyTable
              preset={selectedPreset}
              tableRef={githubTableRef}
              title="GitHub Repositories Search"
              subtitle="Search open-source repositories dynamically on GitHub"
              rowKey="id"
              api={{
                fetcher: fetchGitHubRepositories,
                response: {
                  dataPath: "items",
                  totalPath: "total_count",
                },
              }}
              columns={[
                {
                  key: "owner.avatar_url",
                  title: "Owner",
                  type: "image",
                  width: 60,
                  align: "center",
                },
                {
                  key: "full_name",
                  title: "Repository",
                  render: (val, row) => (
                    <div>
                      <a
                        href={row.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-xs text-primary hover:underline"
                      >
                        {val}
                      </a>
                      <div className="text-[11px] text-gray-400 line-clamp-1 max-w-sm">
                        {row.description || "No description provided."}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "language",
                  title: "Language",
                  type: "badge",
                },
                {
                  key: "stargazers_count",
                  title: "Stars",
                  sortable: true,
                  render: (val) => <span className="font-bold text-amber-500 font-mono text-xs">⭐ {val.toLocaleString()}</span>,
                },
                {
                  key: "forks_count",
                  title: "Forks",
                  render: (val) => <span className="font-mono text-xs text-gray-500">🍴 {val.toLocaleString()}</span>,
                },
              ]}
              actions={[
                {
                  id: "github-link",
                  label: "Open Repo",
                  icon: "🐙",
                  variant: "primary",
                  onClick: (row) => {
                    window.open(row.html_url, "_blank");
                  },
                },
              ]}
            />
          </div>
        )}

        {/* ========================================================
            TAB 9: LIVE API: RICK & MORTY CHARACTERS
            ======================================================== */}
        {activeTab === "rick_morty" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-lime-500/10 border border-lime-500/20 p-4 rounded-2xl text-xs text-lime-700 dark:text-lime-400 flex items-center justify-between">
              <div>
                🧪 <strong>Rick & Morty REST API:</strong> Live character universe directory from <code>https://rickandmortyapi.com/api/character</code>.
              </div>
              <span className="bg-lime-500/20 text-lime-600 dark:text-lime-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                LIVE API
              </span>
            </div>

            <AnyTable<any>
              preset={selectedPreset}
              title="Rick and Morty Character Database"
              subtitle="Consuming public REST API with level 2 response pagination mapping"
              rowKey="id"
              api={{
                fetcher: fetchRickAndMortyCharacters,
                response: {
                  dataPath: "results",
                  totalPath: "info.count",
                },
              }}
              columns={[
                {
                  key: "image",
                  title: "Photo",
                  type: "image",
                  width: 70,
                  align: "center",
                },
                {
                  key: "name",
                  title: "Character",
                  render: (val, row) => (
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white">{val}</div>
                      <div className="text-[11px] text-gray-400">{row.species} ({row.gender})</div>
                    </div>
                  ),
                },
                {
                  key: "status",
                  title: "Status",
                  type: "status",
                  statusMap: {
                    Alive: { label: "Alive", variant: "success" },
                    Dead: { label: "Dead", variant: "danger" },
                    unknown: { label: "Unknown", variant: "neutral" },
                  },
                },
                {
                  key: "origin.name",
                  title: "Origin Location",
                },
              ]}
              actions={[
                {
                  id: "character-details",
                  label: "Details",
                  icon: "🔍",
                  variant: "neutral",
                  onClick: (row) => showToast(`Character: ${row.name} - Status: ${row.status} (${row.species})`),
                },
              ]}
            />
          </div>
        )}

        {/* ========================================================
            TAB 10: IMPERATIVE CONTROLLER (tableRef)
            ======================================================== */}
        {activeTab === "ref_controller" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl text-xs text-indigo-700 dark:text-indigo-300">
              💡 <strong>Table Controller API:</strong> Control the table programmatically from any external button via <code>tableRef.current</code> (e.g. <code>refresh()</code>, <code>setPage()</code>, <code>setSearch()</code>, <code>reset()</code>).
            </div>

            {/* Controller Buttons */}
            <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
              <button
                onClick={() => {
                  refDemoTableRef.current?.refresh();
                  showToast("tableRef.current.refresh() triggered!");
                }}
                className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-soft shadow-md active:scale-95 transition-all"
              >
                🔄 Refresh Table
              </button>

              <button
                onClick={() => {
                  refDemoTableRef.current?.setPage(3);
                  showToast("tableRef.current.setPage(3) triggered!");
                }}
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                ➡️ Jump to Page 3
              </button>

              <button
                onClick={() => {
                  refDemoTableRef.current?.setSearch("Cairo");
                  showToast("tableRef.current.setSearch('Cairo') triggered!");
                }}
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                🔍 Search &apos;Cairo&apos;
              </button>

              <button
                onClick={() => {
                  refDemoTableRef.current?.reset();
                  showToast("tableRef.current.reset() triggered!");
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-bold hover:bg-rose-500/20 ml-auto active:scale-95 transition-all"
              >
                🧹 Reset Table State
              </button>
            </div>

            <AnyTable<MockUser>
              preset={selectedPreset}
              tableRef={refDemoTableRef}
              title="Programmatically Controlled Table"
              api={{
                fetcher: mockFetchUsersApi,
              }}
              rowKey="id"
              columns={[
                { key: "id", title: "ID", width: 100 },
                { key: "name.en", title: "Full Name", sortable: true },
                { key: "email", title: "Email", type: "email" },
                { key: "address.city", title: "City", sortable: true },
                { key: "spend", title: "Spend", type: "currency", sortable: true },
                { key: "status", title: "Status", type: "status" },
              ]}
            />
          </div>
        )}

        {/* ========================================================
            TAB 11: ERROR STATES & RETRY BOUNDARY
            ======================================================== */}
        {activeTab === "error_states" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-xs text-rose-700 dark:text-rose-400">
              💡 <strong>Graceful Error Handling:</strong> If the API returns a 500 error or network failure, AnyTable renders an elegant error state with an automated &quot;Retry&quot; button.
            </div>

            <AnyTable
              preset={selectedPreset}
              title="Failing API Simulation"
              subtitle="Demonstrating built-in error boundary with automated retry trigger"
              api={{
                fetcher: mockFailingApi,
              }}
            />
          </div>
        )}

        {/* ========================================================
            TAB 12: DEVELOPER GUIDE & PRO TIPS
            ======================================================== */}
        {activeTab === "dev_guide" && (
          <DeveloperGuide onCopySnippet={(code, title) => copyToClipboard(code, title)} />
        )}
      </main>

      {/* ========================================================
          FOOTER WITH CREATOR CREDITS & ECOSYSTEM
          ======================================================== */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-white">AnyTable</span>
            <span>—</span>
            <span>Crafted with passion by</span>
            <a
              href="https://github.com/kareemelbalshe"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline"
            >
              Kareem Elbalshe
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/kareemelbalshe/anyTable"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>🐙 GitHub Repository</span>
            </a>
            <a
              href="https://kareemelbalshe.github.io/anyTable/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>🌐 Live Documentation</span>
            </a>
            <a
              href="https://www.npmjs.com/package/@kareemelbalshe/any-table"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>📦 npm Package</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
