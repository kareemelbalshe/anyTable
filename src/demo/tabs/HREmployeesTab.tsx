import React, { useRef } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TableInstance } from "../../types/table.types";
import { TablePreset } from "../../types/theme.types";
import {
  HREmployee,
  fetchHREmployeesApi,
} from "../data/hrData";

export interface HREmployeesTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export const HREmployeesTab: React.FC<HREmployeesTabProps> = ({
  selectedPreset,
  isDarkMode,
  showToast,
}) => {
  const hrTableRef = useRef<TableInstance<HREmployee>>(null);

  return (
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
        key={`hr-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
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
  );
};
