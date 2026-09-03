import React, { useState, useRef, useMemo } from "react";
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
  mockFetchCustomShapeApi,
  mockFailingApi,
  MockUser,
} from "./mockApi";
import "../theme/any-table.css";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "enterprise" | "dummy_products" | "dummy_users" | "github_repos" | "rick_morty" | "ref_controller" | "error_states"
  >("enterprise");

  const [selectedPreset, setSelectedPreset] = useState<TablePreset>("default");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<EnterpriseOrder | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [enterpriseFilterTier, setEnterpriseFilterTier] = useState<string | null>(null);

  // Table Controller Refs
  const enterpriseTableRef = useRef<TableInstance<EnterpriseOrder>>(null);
  const productsTableRef = useRef<TableInstance<any>>(null);
  const usersTableRef = useRef<TableInstance<any>>(null);
  const githubTableRef = useRef<TableInstance<any>>(null);
  const refDemoTableRef = useRef<TableInstance<MockUser>>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
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
    <div className={`min-h-screen ${isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} transition-colors duration-300`}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-xl shadow-primary/30 any-table-fade-in flex items-center gap-2">
          <span>✨</span>
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
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-500 text-sm font-bold flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs">
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
            <div className="flex flex-col gap-1.5 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl text-xs">
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
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200"
              >
                🖨️ Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-soft shadow-md shadow-primary/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="AnyTable Logo"
              className="w-11 h-11 rounded-2xl shadow-lg shadow-primary/30 object-contain border border-white/10"
            />
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                AnyTable
                <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
                  v1.0.0 Production Library
                </span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Autonomous, Zero-Logic Data Table Library with Real-World External APIs
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">🎨 Preset:</span>
              <select
                value={selectedPreset}
                onChange={(e) => {
                  setSelectedPreset(e.target.value as TablePreset);
                  showToast(`Switched design preset to: ${e.target.value.toUpperCase()}`);
                }}
                className="bg-transparent text-xs font-black text-gray-900 dark:text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="default" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Default (Wasel Blue)</option>
                <option value="midnight" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Midnight (Neon Indigo)</option>
                <option value="emerald" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Emerald (Fintech Green)</option>
                <option value="ocean" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Ocean (Deep Cyan)</option>
                <option value="luxury" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Luxury (Champagne Gold)</option>
                <option value="crimson" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Crimson (Rose Red)</option>
                <option value="minimal" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Minimal (Clean Borderless)</option>
                <option value="corporate" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Corporate (Enterprise Navy)</option>
              </select>
            </div>

            <a
              href="https://github.com/kareemelbalshe"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
            >
              <span>⭐ GitHub</span>
            </a>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <span>{isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          {[
            { id: "enterprise", label: "🏢 Enterprise Orders (Ultimate Real-World Showcase)" },
            { id: "dummy_products", label: "🛍️ Live API: DummyJSON Products" },
            { id: "dummy_users", label: "👥 Live API: DummyJSON Users" },
            { id: "github_repos", label: "🐙 Live API: GitHub Repositories" },
            { id: "rick_morty", label: "🧪 Live API: Rick & Morty Characters" },
            { id: "ref_controller", label: "🕹️ Imperative Controller (tableRef)" },
            { id: "error_states", label: "🛡️ Error Handling & Retry Boundary" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================
            TAB 1: ULTIMATE ENTERPRISE REAL-WORLD ORDERS SHOWCASE
            ======================================================== */}
        {activeTab === "enterprise" && (
          <div className="flex flex-col gap-6 any-table-fade-in">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl font-black">
                  💰
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total GMV Volume</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{kpiStats.totalGmv} EGP</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl font-black">
                  📦
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Shipments</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{kpiStats.inTransitCount} In Transit</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl font-black">
                  👑
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">VIP Platinum Orders</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{kpiStats.vipOrders} Orders</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
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
                    className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-soft active:scale-95"
                  >
                    📥 Export CSV
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Marked ${selectedOrderIds.length} orders as Express Priority!`);
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-amber-600 active:scale-95"
                  >
                    ⚡ Bulk Prioritize
                  </button>
                  <button
                    onClick={() => {
                      enterpriseTableRef.current?.clearSelection();
                      setSelectedOrderIds([]);
                    }}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-slate-800 text-xs font-bold rounded-xl hover:bg-gray-300"
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
                    className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 focus:outline-none"
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-soft shadow-md shadow-primary/20 active:scale-95"
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
                  render: (val, row) => (
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
                // 1. Instant PATCH Toggle: Express Shipping
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

                // 2. View Invoice Modal
                {
                  id: "view-invoice",
                  label: "Invoice",
                  icon: "📄",
                  variant: "primary",
                  onClick: (row) => {
                    setSelectedInvoiceOrder(row);
                  },
                },

                // 3. WhatsApp Customer
                {
                  id: "whatsapp",
                  label: "WhatsApp",
                  icon: "💬",
                  variant: "success",
                  onClick: (row) => {
                    showToast(`Opening WhatsApp chat with ${row.customer.name} (${row.customer.phone})`);
                  },
                },

                // 4. Cancel & Refund Action with Confirmation Dialog
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
              onSelectionChange={(rows, keys) => {
                setSelectedOrderIds(keys as string[]);
              }}
            />
          </div>
        )}

        {/* ========================================================
            TAB 2: LIVE EXTERNAL API: DUMMYJSON PRODUCTS
            ======================================================== */}
        {activeTab === "dummy_products" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <div>
                🛍️ <strong>Live Real-World API:</strong> Connected directly to <code>https://dummyjson.com/products</code> with server-side pagination, sorting, and debounced search.
              </div>
              <span className="bg-emerald-500/20 text-emerald-500 font-bold px-2 py-0.5 rounded-full text-[10px]">
                LIVE API
              </span>
            </div>

            <AnyTable
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
                  type: "status",
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
                  title: "Rating",
                  render: (val) => (
                    <span className="font-bold text-xs text-amber-500">
                      ⭐ {val} / 5
                    </span>
                  ),
                },
                {
                  key: "stock",
                  title: "In Stock",
                  render: (val) => (
                    <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${val > 20 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
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
            TAB 3: LIVE EXTERNAL API: DUMMYJSON USERS
            ======================================================== */}
        {activeTab === "dummy_users" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl text-xs text-sky-600 dark:text-sky-400 flex items-center justify-between">
              <div>
                👥 <strong>Live Real-World API:</strong> Connected directly to <code>https://dummyjson.com/users</code> with server-side pagination & live search.
              </div>
              <span className="bg-sky-500/20 text-sky-500 font-bold px-2 py-0.5 rounded-full text-[10px]">
                LIVE API
              </span>
            </div>

            <AnyTable
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
                  type: "status",
                },
                {
                  key: "address.city",
                  title: "City",
                },
              ]}
              actions={[
                {
                  id: "mail-user",
                  label: "Send Message",
                  icon: "✉️",
                  variant: "neutral",
                  onClick: (row) => showToast(`Opening message composer for ${row.email}`),
                },
              ]}
            />
          </div>
        )}

        {/* ========================================================
            TAB 4: LIVE EXTERNAL API: GITHUB REPOSITORIES
            ======================================================== */}
        {activeTab === "github_repos" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl text-xs text-purple-600 dark:text-purple-400 flex items-center justify-between">
              <div>
                🐙 <strong>Live GitHub Search API:</strong> Connected directly to <code>https://api.github.com/search/repositories</code>. Try searching terms like "react", "tailwind", "rust", "nextjs"!
              </div>
              <span className="bg-purple-500/20 text-purple-500 font-bold px-2 py-0.5 rounded-full text-[10px]">
                PUBLIC GITHUB API
              </span>
            </div>

            <AnyTable
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
                  type: "status",
                },
                {
                  key: "stargazers_count",
                  title: "Stars",
                  sortable: true,
                  render: (val) => <span className="font-bold text-amber-400 font-mono text-xs">⭐ {val.toLocaleString()}</span>,
                },
                {
                  key: "forks_count",
                  title: "Forks",
                  render: (val) => <span className="font-mono text-xs text-gray-400">🍴 {val.toLocaleString()}</span>,
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
            TAB 5: LIVE EXTERNAL API: RICK & MORTY CHARACTERS
            ======================================================== */}
        {activeTab === "rick_morty" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-lime-500/10 border border-lime-500/20 p-4 rounded-2xl text-xs text-lime-600 dark:text-lime-400 flex items-center justify-between">
              <div>
                🧪 <strong>Rick & Morty REST API:</strong> Live character universe directory from <code>https://rickandmortyapi.com/api/character</code>.
              </div>
              <span className="bg-lime-500/20 text-lime-500 font-bold px-2 py-0.5 rounded-full text-[10px]">
                LIVE API
              </span>
            </div>

            <AnyTable<any>
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
            TAB 6: IMPERATIVE CONTROLLER (tableRef)
            ======================================================== */}
        {activeTab === "ref_controller" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl text-xs text-indigo-600 dark:text-indigo-400">
              💡 <strong>Table Controller API:</strong> Control the table programmatically from any external button via <code>tableRef.current</code> (e.g. <code>refresh()</code>, <code>setPage()</code>, <code>setSearch()</code>, <code>reset()</code>).
            </div>

            {/* Controller Buttons */}
            <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <button
                onClick={() => {
                  refDemoTableRef.current?.refresh();
                  showToast("tableRef.current.refresh() triggered!");
                }}
                className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-soft shadow-md active:scale-95"
              >
                🔄 Refresh Table
              </button>

              <button
                onClick={() => {
                  refDemoTableRef.current?.setPage(3);
                  showToast("tableRef.current.setPage(3) triggered!");
                }}
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold hover:bg-gray-200 active:scale-95"
              >
                ➡️ Jump to Page 3
              </button>

              <button
                onClick={() => {
                  refDemoTableRef.current?.setSearch("Cairo");
                  showToast("tableRef.current.setSearch('Cairo') triggered!");
                }}
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold hover:bg-gray-200 active:scale-95"
              >
                🔍 Search 'Cairo'
              </button>

              <button
                onClick={() => {
                  refDemoTableRef.current?.reset();
                  showToast("tableRef.current.reset() triggered!");
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-bold hover:bg-rose-500/20 ml-auto active:scale-95"
              >
                🧹 Reset Table State
              </button>
            </div>

            <AnyTable<MockUser>
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
            TAB 7: ERROR STATES & RETRY BOUNDARY
            ======================================================== */}
        {activeTab === "error_states" && (
          <div className="flex flex-col gap-4 any-table-fade-in">
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-xs text-rose-600 dark:text-rose-400">
              💡 <strong>Graceful Error Handling:</strong> If the API returns a 500 error or network failure, AnyTable renders an elegant error state with an automated "Retry" button.
            </div>

            <AnyTable
              title="Failing API Simulation"
              subtitle="Demonstrating built-in error boundary with automated retry trigger"
              api={{
                fetcher: mockFailingApi,
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
