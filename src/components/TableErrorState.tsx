import React from "react";

export interface TableErrorStateProps {
  error: any;
  onRetry?: () => void;
}

export const TableErrorState: React.FC<TableErrorStateProps> = ({ error, onRetry }) => {
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || error?.response?.data?.message || "Failed to load table data.";

  return (
    <div className="w-full py-14 px-6 flex flex-col items-center justify-center text-center any-table-fade-in">
      <div className="w-14 h-14 mb-4 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl border border-rose-500/20">
        ⚠️
      </div>

      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
        Unable to load data
      </h3>

      <p className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-medium max-w-md mb-5 leading-relaxed bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/10">
        {errorMessage}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-md active:scale-95"
        >
          <span>🔄</span>
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};
