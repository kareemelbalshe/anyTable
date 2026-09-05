import React, { useState, useMemo, useRef } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TableInstance } from "../../types/table.types";
import { TablePreset } from "../../types/theme.types";
import {
  EnterpriseOrder,
  REAL_WORLD_ORDERS_DB,
  fetchEnterpriseOrdersApi,
} from "../enterpriseOrdersData";

export interface EnterpriseOrdersTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  onViewInvoice: (order: EnterpriseOrder) => void;
  showToast: (msg: string) => void;
}

export const EnterpriseOrdersTab: React.FC<EnterpriseOrdersTabProps> = ({
  selectedPreset,
  isDarkMode,
  onViewInvoice,
  showToast,
}) => {
  const enterpriseTableRef = useRef<TableInstance<EnterpriseOrder>>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [enterpriseFilterTier, setEnterpriseFilterTier] = useState<string | null>(null);

  const kpiStats = useMemo(() => {
    const totalGmv = REAL_WORLD_ORDERS_DB.reduce((sum, o) => sum + o.totalAmount, 0);
    const deliveredCount = REAL_WORLD_ORDERS_DB.filter((o) => o.fulfillmentStatus === "Delivered").length;
    const inTransitCount = REAL_WORLD_ORDERS_DB.filter(
      (o) => o.fulfillmentStatus === "In Transit" || o.fulfillmentStatus === "Processing"
    ).length;
    const vipOrders = REAL_WORLD_ORDERS_DB.filter((o) => o.customer.tier === "VIP Platinum").length;

    return {
      totalGmv: totalGmv.toLocaleString("en-US"),
      deliveredCount,
      inTransitCount,
      vipOrders,
    };
  }, []);

  return (
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
            <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
              {Math.round((kpiStats.deliveredCount / 120) * 100)}% Success
            </div>
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
        key={`ent-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
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
                  alt={row.customer.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                  }}
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
            onClick: (row) => onViewInvoice(row),
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
              message: (row) =>
                `Are you sure you want to cancel ${row.orderNumber} for ${row.customer.name}? Total amount (${row.totalAmount.toLocaleString()} EGP) will be refunded.`,
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
  );
};
