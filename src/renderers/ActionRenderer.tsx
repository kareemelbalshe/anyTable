import React, { useState } from "react";
import { TableAction, SwitchAction, ActionContext, ActionVariant } from "../types/action.types";
import { ConfirmModal } from "../components/TableConfirmDialog";

/**
 * Safely resolves and renders any icon format:
 * - JSX Elements (e.g. <FiEdit />, <svg>...)
 * - React Components passed directly (e.g. FiEdit from react-icons, Lucide, or custom components)
 * - Dynamic generator functions: (row) => <FiLock /> or (row) => FiLock
 * - Strings & Emojis: "✏️", "🗑️"
 * - Image URLs: "/icon.svg", "https://...", "data:image/..."
 */
export function renderActionIcon<TData = any>(
  rawIcon: any,
  row: TData
): React.ReactNode {
  if (!rawIcon) return null;

  // 1. Direct JSX Element (e.g. <FiEdit />, <svg>...</svg>)
  if (React.isValidElement(rawIcon)) {
    return rawIcon;
  }

  // 2. React Component or Generator Function
  if (typeof rawIcon === "function") {
    // Check if it's a React Component Class
    if (rawIcon.prototype && (rawIcon.prototype as any).isReactComponent) {
      const Component = rawIcon;
      return <Component className="w-4 h-4 shrink-0" />;
    }

    // Check if it's a Component function (by convention, Component names start with Uppercase, e.g. FiEdit, LuTrash, Icon)
    const fnName = rawIcon.displayName || rawIcon.name || "";
    const isNamedComponent = /^[A-Z]/.test(fnName);

    if (isNamedComponent) {
      const IconComponent = rawIcon;
      return <IconComponent className="w-4 h-4 shrink-0" />;
    }

    // Otherwise, treat as a dynamic generator function: (row) => icon
    try {
      const resolved = rawIcon(row);
      return renderActionIcon(resolved, row);
    } catch {
      // Fallback: If calling as function failed, render as component
      const FallbackComponent = rawIcon;
      return <FallbackComponent className="w-4 h-4 shrink-0" />;
    }
  }

  // 3. React forwardRef / memo component objects
  if (
    typeof rawIcon === "object" &&
    rawIcon !== null &&
    (rawIcon.$$typeof || (rawIcon as any).render)
  ) {
    const MemoOrForwardRef = rawIcon as React.ComponentType<any>;
    return <MemoOrForwardRef className="w-4 h-4 shrink-0" />;
  }

  // 4. String / Image URL / Emoji
  if (typeof rawIcon === "string") {
    // Check if it's an image file path or URL
    if (
      rawIcon.startsWith("http://") ||
      rawIcon.startsWith("https://") ||
      rawIcon.startsWith("/") ||
      rawIcon.startsWith("./") ||
      rawIcon.startsWith("data:image/") ||
      /\.(png|jpe?g|svg|webp|gif|ico)$/i.test(rawIcon)
    ) {
      return (
        <img
          src={rawIcon}
          alt="action-icon"
          className="w-4 h-4 object-contain shrink-0 inline-block"
        />
      );
    }

    // Emoji or plain text icon
    return <span className="inline-flex items-center justify-center leading-none text-base">{rawIcon}</span>;
  }

  return rawIcon as React.ReactNode;
}

export interface ActionRendererProps<TData = any> {
  row: TData;
  actions: TableAction<TData>[];
  context: ActionContext<TData>;
}

const VARIANT_CLASSES: Record<ActionVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-soft shadow-sm shadow-primary/20",
  secondary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20",
  success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20",
  warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-500/20",
  danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/20",
  info: "bg-sky-500 text-white hover:bg-sky-600 shadow-sm shadow-sky-500/20",
  neutral: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700",
  ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
};

export const ActionRenderer: React.FC<ActionRendererProps> = ({ row, actions, context }) => {
  const [activeConfirm, setActiveConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: "danger" | "warning" | "info";
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  const [inFlightActions, setInFlightActions] = useState<Record<string, boolean>>({});

  if (!actions || !actions.length) {
    return null;
  }

  const handleActionClick = async (action: TableAction<any>) => {
    // Check if confirmation dialog is configured
    if (action.confirmation) {
      const title =
        typeof action.confirmation.title === "function"
          ? action.confirmation.title(row)
          : action.confirmation.title || "Confirm Action";
      const message =
        typeof action.confirmation.message === "function"
          ? action.confirmation.message(row)
          : action.confirmation.message || "Are you sure you want to perform this action?";

      setActiveConfirm({
        isOpen: true,
        title,
        message,
        confirmText: action.confirmation.confirmText || "Confirm",
        cancelText: action.confirmation.cancelText || "Cancel",
        type: action.confirmation.type || "danger",
        onConfirm: async () => {
          setActiveConfirm(null);
          await executeAction(action);
        },
      });
      return;
    }

    await executeAction(action);
  };

  const executeAction = async (action: TableAction<any>) => {
    if (action.type === "button" || !action.type) {
      setInFlightActions((prev) => ({ ...prev, [action.id]: true }));
      try {
        await action.onClick(row, context);
      } finally {
        setInFlightActions((prev) => ({ ...prev, [action.id]: false }));
      }
    }
  };

  const handleSwitchToggle = async (switchAction: SwitchAction<any>, currentChecked: boolean) => {
    const nextChecked = !currentChecked;
    setInFlightActions((prev) => ({ ...prev, [switchAction.id]: true }));
    try {
      await switchAction.onChange(row, nextChecked, context);
    } finally {
      setInFlightActions((prev) => ({ ...prev, [switchAction.id]: false }));
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2 pr-2">
        {actions.map((action) => {
          // Check show / hide conditions
          if (typeof action.hide === "function" && action.hide(row)) return null;
          if (typeof action.show === "function" && !action.show(row)) return null;

          const disabled =
            typeof action.disabled === "function" ? action.disabled(row) : Boolean(action.disabled);
          const isPending =
            inFlightActions[action.id] ||
            (typeof action.loading === "function" ? action.loading(row) : Boolean(action.loading));

          const label =
            typeof action.label === "function" ? action.label(row) : action.label;
          const renderedIcon = renderActionIcon(action.icon, row);
          const tooltip =
            typeof action.tooltip === "function" ? action.tooltip(row) : action.tooltip;
          const customClass =
            typeof action.className === "function" ? action.className(row) : action.className || "";

          // 1. Custom Action
          if (action.type === "custom" && action.render) {
            return (
              <React.Fragment key={action.id}>
                {action.render(row, context)}
              </React.Fragment>
            );
          }

          // 2. Switch / Toggle Action
          if (action.type === "switch") {
            const switchAction = action as SwitchAction<any>;
            const checked = switchAction.checked(row);

            return (
              <div
                key={action.id}
                className="flex items-center gap-2"
                title={tooltip || label}
              >
                {label && <span className="text-xs font-semibold text-gray-500">{label}:</span>}
                <button
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  disabled={disabled || isPending}
                  onClick={() => handleSwitchToggle(switchAction, checked)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    checked ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                  } ${customClass}`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      checked ? "translate-x-5" : "translate-x-0"
                    }`}
                  >
                    {isPending && (
                      <span className="w-2.5 h-2.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </span>
                </button>
              </div>
            );
          }

          // 3. Standard Button Action
          const resolvedVariant =
            typeof action.variant === "function" ? action.variant(row) : action.variant || "neutral";
          const variantClass = VARIANT_CLASSES[resolvedVariant] || VARIANT_CLASSES.neutral;
          const paddingClass = !label && renderedIcon ? "p-2 min-w-[2rem]" : "px-3 py-1.5";

          return (
            <button
              key={action.id}
              type="button"
              disabled={disabled || isPending}
              onClick={() => handleActionClick(action)}
              title={tooltip}
              style={action.color ? { backgroundColor: action.color, color: "#ffffff" } : undefined}
              className={`inline-flex items-center justify-center gap-1.5 ${paddingClass} rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${variantClass} ${customClass}`}
            >
              {isPending ? (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                renderedIcon && <span className="text-sm flex items-center justify-center shrink-0">{renderedIcon}</span>
              )}
              {label && <span>{label}</span>}
            </button>
          );
        })}
      </div>

      {activeConfirm && (
        <ConfirmModal
          isOpen={activeConfirm.isOpen}
          title={activeConfirm.title}
          message={activeConfirm.message}
          confirmText={activeConfirm.confirmText}
          cancelText={activeConfirm.cancelText}
          type={activeConfirm.type}
          onClose={() => setActiveConfirm(null)}
          onConfirm={activeConfirm.onConfirm}
        />
      )}
    </>
  );
};
