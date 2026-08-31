import React from "react";

export interface TableSkeletonProps {
  columnsCount?: number;
  rowsCount?: number;
  hasActions?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columnsCount = 5,
  rowsCount = 5,
  hasActions = true,
}) => {
  return (
    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 bg-white dark:bg-slate-900">
      {Array.from({ length: rowsCount }).map((_, rowIndex) => (
        <tr key={rowIndex} className="any-table-pulse">
          {Array.from({ length: columnsCount }).map((_, colIndex) => (
            <td key={colIndex} className="py-4 px-4 align-middle">
              <div
                className="h-4 bg-gray-200 dark:bg-slate-700/60 rounded-md"
                style={{
                  width: `${Math.floor(40 + ((colIndex * 19 + rowIndex * 13) % 45))}%`,
                }}
              />
            </td>
          ))}
          {hasActions && (
            <td className="py-4 px-4 text-right align-middle pr-6">
              <div className="inline-flex gap-2 justify-end">
                <div className="w-14 h-7 bg-gray-200 dark:bg-slate-700/60 rounded-xl" />
                <div className="w-14 h-7 bg-gray-200 dark:bg-slate-700/60 rounded-xl" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
};
