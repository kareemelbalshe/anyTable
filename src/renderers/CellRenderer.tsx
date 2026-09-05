import React from "react";
import { ColumnDef } from "../types/column.types";
import { getNestedValue } from "../adapters/objectUtils";
import {
  StringRenderer,
  NumberRenderer,
  BooleanRenderer,
  DateRenderer,
  CurrencyRenderer,
  ImageRenderer,
  StatusRenderer,
  ArrayRenderer,
  ObjectRenderer,
  UrlRenderer,
  EmailRenderer,
  PhoneRenderer,
  ProgressRenderer,
  RatingRenderer,
  BadgeRenderer,
} from "./DefaultRenderers";

export interface CellRendererProps<TData = any> {
  row: TData;
  column: ColumnDef<TData>;
  rowIndex: number;
}

export const CellRenderer: React.FC<CellRendererProps> = ({ row, column, rowIndex }) => {
  const value = getNestedValue(row, column.key);

  // 1. Custom Render (Full developer control)
  if (column.render && typeof column.render === "function") {
    return <>{column.render(value, row, rowIndex)}</>;
  }

  // 2. Custom Formatter (Simple value formatting)
  if (column.formatter && typeof column.formatter === "function") {
    return <>{column.formatter(value, row, rowIndex)}</>;
  }

  // 3. Typed Renderers Dispatcher
  switch (column.type) {
    case "boolean":
      return <BooleanRenderer value={value} column={column} />;
    case "number":
      return <NumberRenderer value={value} column={column} />;
    case "currency":
      return <CurrencyRenderer value={value} column={column} />;
    case "date":
      return <DateRenderer value={value} column={column} isDateTime={false} />;
    case "datetime":
      return <DateRenderer value={value} column={column} isDateTime={true} />;
    case "image":
      return <ImageRenderer value={value} column={column} />;
    case "status":
      return <StatusRenderer value={value} column={column} />;
    case "progress":
      return <ProgressRenderer value={value} column={column} />;
    case "rating":
      return <RatingRenderer value={value} column={column} />;
    case "badge":
      return <BadgeRenderer value={value} column={column} />;
    case "array":
      return <ArrayRenderer value={value} column={column} />;
    case "object":
      return <ObjectRenderer value={value} column={column} />;
    case "url":
      return <UrlRenderer value={value} column={column} />;
    case "email":
      return <EmailRenderer value={value} column={column} />;
    case "phone":
      return <PhoneRenderer value={value} column={column} />;
    case "string":
    default:
      return <StringRenderer value={value} column={column} />;
  }
};
