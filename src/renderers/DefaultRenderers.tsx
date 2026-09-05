import React from "react";
import { ColumnDef } from "../types/column.types";

export const FallbackPlaceholder = () => (
  <span className="text-gray-400 dark:text-gray-500 font-mono text-sm">—</span>
);

export const StringRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (value === null || value === undefined || value === "") {
    return <FallbackPlaceholder />;
  }
  const str = String(value);
  return (
    <span className="truncate block max-w-xs font-normal text-sm" title={str}>
      {str}
    </span>
  );
};

export const NumberRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return <FallbackPlaceholder />;
  }
  const num = Number(value);
  return (
    <span className="font-mono text-sm font-medium">
      {num.toLocaleString()}
    </span>
  );
};

export const BooleanRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (value === null || value === undefined) {
    return <FallbackPlaceholder />;
  }
  const isTrue = Boolean(value);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
        isTrue
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isTrue ? "bg-emerald-500" : "bg-rose-500"}`} />
      {isTrue ? "Yes" : "No"}
    </span>
  );
};

export const DateRenderer: React.FC<{ value: any; column: ColumnDef; isDateTime?: boolean }> = ({
  value,
  isDateTime = false,
}) => {
  if (!value) return <FallbackPlaceholder />;

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) {
    return <StringRenderer value={value} column={{ key: "" }} />;
  }

  return (
    <span className="whitespace-nowrap text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
      {date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
      {isDateTime && (
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">
          {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </span>
  );
};

export const CurrencyRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value, column }) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return <FallbackPlaceholder />;
  }
  const amount = Number(value);
  const currency = column.currency || "EGP";

  return (
    <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
      {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
      <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{currency}</span>
    </span>
  );
};

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

export const ImageRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  let src = "";
  if (typeof value === "string") {
    src = value;
  } else if (Array.isArray(value) && value.length > 0) {
    src = typeof value[0] === "string" ? value[0] : value[0]?.url || "";
  } else if (value && typeof value === "object") {
    src = value.url || "";
  }

  if (!src) {
    src = DEFAULT_AVATAR;
  }

  return (
    <div className="flex items-center justify-center">
      <img
        src={src}
        alt="Thumbnail"
        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-sm"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
        }}
      />
    </div>
  );
};

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  delivered: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  completed: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  approved: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  paid: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  online: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  open: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  investigating: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  pending: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  processing: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  banned: { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
  rejected: { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
  cancelled: { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
  offline: { bg: "bg-gray-500/10 border-gray-500/20", text: "text-gray-600 dark:text-gray-400", dot: "bg-gray-500" },
  closed: { bg: "bg-gray-500/10 border-gray-500/20", text: "text-gray-600 dark:text-gray-400", dot: "bg-gray-500" },
};

export const StatusRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value, column }) => {
  if (value === null || value === undefined || value === "") {
    return <FallbackPlaceholder />;
  }

  const str = String(value);
  const lower = str.toLowerCase();

  // Custom status map from column if provided
  if (column.statusMap && column.statusMap[str]) {
    const custom = column.statusMap[str];
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border"
        style={{ color: custom.color, backgroundColor: custom.bg }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: custom.color }} />
        {custom.label || str}
      </span>
    );
  }

  const theme = STATUS_COLOR_MAP[lower] || {
    bg: "bg-gray-500/10 border-gray-500/20",
    text: "text-gray-700 dark:text-gray-300",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.bg} ${theme.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
      {str}
    </span>
  );
};

export const ArrayRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (!Array.isArray(value) || value.length === 0) {
    return <FallbackPlaceholder />;
  }

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {value.slice(0, 3).map((item, idx) => (
        <span
          key={idx}
          className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        >
          {typeof item === "object" ? JSON.stringify(item) : String(item)}
        </span>
      ))}
      {value.length > 3 && (
        <span className="text-xs text-gray-400 font-medium">+{value.length - 3}</span>
      )}
    </div>
  );
};

export const ObjectRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (!value || typeof value !== "object") {
    return <FallbackPlaceholder />;
  }

  // Multilingual object { en, ar }
  if ("en" in value || "ar" in value) {
    return <span className="font-medium text-sm">{value.en || value.ar || ""}</span>;
  }

  return (
    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 truncate block max-w-xs" title={JSON.stringify(value)}>
      {JSON.stringify(value)}
    </span>
  );
};

export const UrlRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (!value) return <FallbackPlaceholder />;
  const str = String(value);
  return (
    <a
      href={str}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
    >
      <span className="truncate max-w-[150px]">{str}</span>
      <span className="text-xs">↗</span>
    </a>
  );
};

export const EmailRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (!value) return <FallbackPlaceholder />;
  const str = String(value);
  return (
    <a
      href={`mailto:${str}`}
      className="text-primary hover:underline text-sm font-medium truncate block max-w-xs"
    >
      {str}
    </a>
  );
};

export const PhoneRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (!value) return <FallbackPlaceholder />;
  const str = String(value);
  return (
    <a
      href={`tel:${str}`}
      className="font-mono text-sm text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
    >
      {str}
    </a>
  );
};

export const ProgressRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return <FallbackPlaceholder />;
  }
  const pct = Math.min(100, Math.max(0, Math.round(Number(value))));
  const barColor =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 50
      ? "bg-blue-500"
      : pct >= 30
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <div className="flex items-center gap-2.5 min-w-[120px]">
      <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300 w-9 text-right">
        {pct}%
      </span>
    </div>
  );
};

export const RatingRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return <FallbackPlaceholder />;
  }
  const rating = Number(value);
  return (
    <div className="inline-flex items-center gap-1.5 font-medium text-xs text-amber-500">
      <span className="text-sm">★</span>
      <span className="font-bold text-gray-900 dark:text-gray-100">{rating.toFixed(1)}</span>
      <span className="text-gray-400 dark:text-gray-500 text-[10px]">/ 5</span>
    </div>
  );
};

export const BadgeRenderer: React.FC<{ value: any; column: ColumnDef }> = ({ value }) => {
  if (value === null || value === undefined || value === "") {
    return <FallbackPlaceholder />;
  }
  const str = String(value);
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
      {str}
    </span>
  );
};

