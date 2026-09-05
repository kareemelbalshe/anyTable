import React, { useRef } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TableInstance } from "../../types/table.types";
import { TablePreset } from "../../types/theme.types";
import { MockUser, mockFetchUsersApi } from "../mockApi";

export interface ControllerTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export const ControllerTab: React.FC<ControllerTabProps> = ({
  selectedPreset,
  isDarkMode,
  showToast,
}) => {
  const refDemoTableRef = useRef<TableInstance<MockUser>>(null);

  return (
    <div className="flex flex-col gap-4 any-table-fade-in">
      <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl text-xs text-indigo-700 dark:text-indigo-300">
        💡 <strong>Table Controller API:</strong> Control the table programmatically from any external button via{" "}
        <code>tableRef.current</code> (e.g. <code>refresh()</code>, <code>setPage()</code>, <code>setSearch()</code>, <code>reset()</code>).
      </div>

      {/* Controller Action Buttons */}
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
        key={`ctrl-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
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
  );
};
