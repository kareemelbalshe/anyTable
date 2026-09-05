import React, { useRef } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TableInstance } from "../../types/table.types";
import { TablePreset } from "../../types/theme.types";
import {
  SaaSSubscription,
  fetchSaaSSubscriptionsApi,
} from "../data/saasData";

export interface SaaSSubscriptionsTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export const SaaSSubscriptionsTab: React.FC<SaaSSubscriptionsTabProps> = ({
  selectedPreset,
  isDarkMode,
  showToast,
}) => {
  const saasTableRef = useRef<TableInstance<SaaSSubscription>>(null);

  return (
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
        key={`saas-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
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
                  className="w-9 h-9 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='%236366f1'/%3E%3Ctext x='20' y='25' font-family='sans-serif' font-size='16' font-weight='bold' fill='white' text-anchor='middle'%3E🏢%3C/text%3E%3C/svg%3E";
                  }}
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
              <span
                className={`font-bold text-xs px-2 py-0.5 rounded-md ${
                  cycle === "Annual"
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                {cycle}
              </span>
            ),
          },
          {
            key: "seats",
            title: "Seats",
            width: 90,
            align: "center",
            render: (seats) => (
              <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">
                {seats} users
              </span>
            ),
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
  );
};
