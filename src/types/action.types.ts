import React from "react";

export type ActionVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "ghost";

export interface ActionContext<TData = any> {
  /**
   * Refetches data from the API adapter or triggers table re-render.
   */
  refresh: () => Promise<void> | void;

  /**
   * Whether the table is currently loading or fetching.
   */
  loading: boolean;

  /**
   * Current active page number.
   */
  page: number;

  /**
   * List of currently selected row objects.
   */
  selectedRows: TData[];

  /**
   * Sets the active page.
   */
  setPage: (page: number) => void;
}

export interface ActionConfirmation<TData = any> {
  title?: string | ((row: TData) => string);
  message?: string | ((row: TData) => string);
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export interface BaseTableAction<TData = any> {
  /**
   * Unique action identifier (e.g. 'view', 'edit', 'delete', 'toggle-active').
   */
  id: string;

  /**
   * Action button text or text generator.
   */
  label?: string | ((row: TData) => string);

  /**
   * Action icon element or icon generator.
   */
  icon?: React.ReactNode | ((row: TData) => React.ReactNode);

  /**
   * Color theme variant. Defaults to 'neutral'.
   */
  variant?: ActionVariant | ((row: TData) => ActionVariant);

  /**
   * Custom CSS classes for the action button.
   */
  className?: string | ((row: TData) => string);

  /**
   * Custom hex/rgb/tailwind color override.
   */
  color?: string;

  /**
   * Tooltip to show on hover.
   */
  tooltip?: string | ((row: TData) => string);

  /**
   * Condition to disable the action for this row.
   */
  disabled?: boolean | ((row: TData) => boolean);

  /**
   * Condition to show the action for this row.
   */
  show?: boolean | ((row: TData) => boolean);

  /**
   * Condition to hide the action for this row.
   */
  hide?: boolean | ((row: TData) => boolean);

  /**
   * Loading state for asynchronous action executions.
   */
  loading?: boolean | ((row: TData) => boolean);

  /**
   * Built-in confirmation dialog configuration before firing onClick.
   */
  confirmation?: ActionConfirmation<TData>;
}

export interface ButtonAction<TData = any> extends BaseTableAction<TData> {
  type?: "button";

  /**
   * Click handler callback invoked when developer action is clicked.
   * Receives the full row data and the table context.
   */
  onClick: (row: TData, context: ActionContext<TData>) => void | Promise<void>;
}

export interface SwitchAction<TData = any> extends BaseTableAction<TData> {
  type: "switch";

  /**
   * Evaluates whether the switch is currently turned ON (true) or OFF (false) for this row.
   */
  checked: (row: TData) => boolean;

  /**
   * Callback invoked when user toggles the switch.
   * Perfect for instant PATCH / PUT operations (e.g. updating active status, ban user).
   */
  onChange: (
    row: TData,
    nextChecked: boolean,
    context: ActionContext<TData>
  ) => void | Promise<void>;

  /**
   * Optional text label displayed when switch is active.
   */
  activeLabel?: string;

  /**
   * Optional text label displayed when switch is inactive.
   */
  inactiveLabel?: string;
}

export interface CustomAction<TData = any> extends BaseTableAction<TData> {
  type: "custom";

  /**
   * Fully custom action renderer.
   */
  render: (row: TData, context: ActionContext<TData>) => React.ReactNode;
}

export type TableAction<TData = any> =
  | ButtonAction<TData>
  | SwitchAction<TData>
  | CustomAction<TData>;
