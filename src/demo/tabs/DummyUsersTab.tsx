import React, { useRef } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TableInstance } from "../../types/table.types";
import { TablePreset } from "../../types/theme.types";
import { fetchDummyJsonUsers } from "../externalApis";

export interface DummyUsersTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export const DummyUsersTab: React.FC<DummyUsersTabProps> = ({
  selectedPreset,
  isDarkMode,
  showToast,
}) => {
  const usersTableRef = useRef<TableInstance<any>>(null);

  return (
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
        key={`users-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
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
  );
};
