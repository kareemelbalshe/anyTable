import React, { useRef } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TableInstance } from "../../types/table.types";
import { TablePreset } from "../../types/theme.types";
import {
  CloudServerNode,
  fetchCloudServersApi,
} from "../data/cloudData";

export interface CloudDevOpsTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export const CloudDevOpsTab: React.FC<CloudDevOpsTabProps> = ({
  selectedPreset,
  isDarkMode,
  showToast,
}) => {
  const cloudTableRef = useRef<TableInstance<CloudServerNode>>(null);

  return (
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
        key={`cloud-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
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
              <span
                className={`font-mono text-xs font-bold ${
                  latency === 0
                    ? "text-gray-400"
                    : latency < 35
                    ? "text-emerald-500"
                    : latency < 80
                    ? "text-amber-500"
                    : "text-rose-500"
                }`}
              >
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
              message: (row) =>
                `Are you sure you want to reboot ${row.hostname}? Services may experience momentary downtime.`,
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
  );
};
