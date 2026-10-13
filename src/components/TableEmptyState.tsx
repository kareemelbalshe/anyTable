import React from "react";
import { TableMessages, enMessages } from "../i18n";

export interface TableEmptyStateProps {
  title?: string;
  description?: string;
  isSearchActive?: boolean;
  onClearSearch?: () => void;
  colSpan?: number;
  messages?: TableMessages;
}

export function TableEmptyState({
  title,
  description,
  isSearchActive = false,
  onClearSearch,
  colSpan,
  messages = enMessages,
}: TableEmptyStateProps) {
  const defaultTitle = isSearchActive
    ? messages.noRecordsTitle
    : messages.noRecordsTitle;
  const defaultDescription = isSearchActive
    ? messages.noRecordsDescription
    : messages.noRecordsDescription;

  const content = (
    <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center any-table-fade-in">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 flex items-center justify-center text-3xl shadow-inner">
        {isSearchActive ? "🔍" : "📂"}
      </div>

      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
        {title || defaultTitle}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-5 leading-relaxed">
        {description || defaultDescription}
      </p>

      {isSearchActive && onClearSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-soft transition-all shadow-sm shadow-primary/20 active:scale-95 cursor-pointer"
        >
          {messages.clearSearch}
        </button>
      )}
    </div>
  );

  if (colSpan !== undefined) {
    return (
      <tbody>
        <tr>
          <td colSpan={colSpan} className="p-0">
            {content}
          </td>
        </tr>
      </tbody>
    );
  }

  return content;
}
