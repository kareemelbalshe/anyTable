import React from "react";
import { AnyTable } from "../../components/AnyTable";
import { TablePreset } from "../../types/theme.types";
import { mockFailingApi } from "../mockApi";

export interface ErrorStatesTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
}

export const ErrorStatesTab: React.FC<ErrorStatesTabProps> = ({
  selectedPreset,
  isDarkMode,
}) => {
  return (
    <div className="flex flex-col gap-4 any-table-fade-in">
      <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-xs text-rose-700 dark:text-rose-400">
        💡 <strong>Graceful Error Handling:</strong> If the API returns a 500 error or network failure, AnyTable renders an elegant error state with an automated &quot;Retry&quot; button.
      </div>

      <AnyTable
        key={`err-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
        preset={selectedPreset}
        title="Failing API Simulation"
        subtitle="Demonstrating built-in error boundary with automated retry trigger"
        api={{
          fetcher: mockFailingApi,
        }}
      />
    </div>
  );
};
